import { createContext, useContext, useReducer, useEffect } from 'react';

const AppStateContext = createContext();

const initialState = {
  partnerLoveLanguage: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_PARTNER_LOVE_LANGUAGE':
      return {
        ...state,
        partnerLoveLanguage: action.payload,
      };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Load state from localStorage on initial load
  useEffect(() => {
    try {
      const savedState = localStorage.getItem('lovelingoAppState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Only restore the partner love language if it exists
        if (parsedState.partnerLoveLanguage) {
          dispatch({ 
            type: 'SET_PARTNER_LOVE_LANGUAGE', 
            payload: parsedState.partnerLoveLanguage 
          });
        }
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('lovelingoAppState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }, [state]);
  
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  
  return context;
}
