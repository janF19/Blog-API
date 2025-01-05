// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  moduleFileExtensions: ['js', 'json', 'node'],
  testMatch: ['**/src/tests/**/*.test.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  verbose: true,
  rootDir: './'
};