import neo4j from 'neo4j-driver';

// Create Neo4j driver
const createNeo4jDriver = () => {
  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';
  
  return neo4j.driver(uri, neo4j.auth.basic(user, password));
};

// Export the driver
export const driver = createNeo4jDriver();

// Close the driver when the application is shutting down
process.on('SIGTERM', () => {
  driver.close();
});

export default driver;
