import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import { storage } from "./storage.js";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1000 }
);

// Configure session storage based on environment
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  
  return session({
    secret: process.env.SESSION_SECRET || 'dev-secret-do-not-use-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user,
  tokens
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app) {
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup OAuth for different providers
  setupOAuthProviders(app);

  // Replit Auth setup
  await setupReplitAuth(app);

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
}

function setupOAuthProviders(app) {
  // Google OAuth routes
  app.get('/api/auth/google', (req, res) => {
    // Placeholder for Google OAuth
    res.status(501).json({ message: "Google OAuth not implemented yet" });
  });

  // Facebook OAuth routes
  app.get('/api/auth/facebook', (req, res) => {
    // Placeholder for Facebook OAuth
    res.status(501).json({ message: "Facebook OAuth not implemented yet" });
  });

  // Apple OAuth routes
  app.get('/api/auth/apple', (req, res) => {
    // Placeholder for Apple OAuth
    res.status(501).json({ message: "Apple OAuth not implemented yet" });
  });

  // Microsoft OAuth routes
  app.get('/api/auth/microsoft', (req, res) => {
    // Placeholder for Microsoft OAuth
    res.status(501).json({ message: "Microsoft OAuth not implemented yet" });
  });
}

async function setupReplitAuth(app) {
  const config = await getOidcConfig();

  const verify = async (
    tokens,
    verified
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID || '',
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated = async (req, res, next) => {
  const user = req.user;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    return res.redirect("/api/login");
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    return res.redirect("/api/login");
  }
};
