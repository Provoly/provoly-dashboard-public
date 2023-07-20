module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/projects/'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts', '<rootDir>/setup-crypto-jest.ts'],
  moduleNameMapper: {
    '^@provoly/dashboard(.*)$': '<rootDir>/projects/provoly/dashboard$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(ol))/', 'node_modules/(?!(ol-mapbox-style))/']
};
