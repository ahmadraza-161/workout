/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // jest-expo resolves lucide's "react-native" export condition, which is
    // untranspiled ESM and cannot be parsed. The package ships a CommonJS
    // build, so point tests at that instead of transforming 1,600 icon files.
    '^lucide-react-native$': '<rootDir>/node_modules/lucide-react-native/dist/cjs/lucide-react-native.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/drizzle/'],
  // jest-expo's default list does not cover lucide-react-native, which ships
  // untranspiled ESM. Without this, any component that imports an icon fails
  // to parse under Jest.
};
