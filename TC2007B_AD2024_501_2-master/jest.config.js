module.exports = {
    preset: 'jest-expo',
    transform: {
      '^.+\\.[tj]sx?$': 'babel-jest',  // Usa babel-jest para transformar archivos JS y TS
    },
    transformIgnorePatterns: [
      'node_modules/(?!(firebase|@firebase|react-native|@react-native|expo|@expo))'
    ],
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
  };