module.exports = {
    testEnvironment: 'node', // Entorno de pruebas para Node.js
    coveragePathIgnorePatterns: ['/node_modules/'], // Ignorar node_modules
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'], // Patrón para encontrar archivos de prueba
  };