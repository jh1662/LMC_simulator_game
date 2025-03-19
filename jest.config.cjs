/// /** @type {import('ts-jest').JestConfigWithTsJest} **/
/// //^ allows it to run ".test.ts" files directly
module.exports = {
    ///preset: "ts-jest",
    testEnvironment: "jsdom",
    //^ Changed from node
    testPathIgnorePatterns: ['/node_modules/'],
    //^ Saves much time by not loooking though an ungodly number of files
    /// transform: { "^.+.tsx?$": ["ts-jest",{}] },
    /// //^ allows TS test files to be tested directly
    testTimeout: 1000000,
    //^ Longer LMC assembly programs will take a longtime - especially with regular sleep intervals
    setupFilesAfterEnv: ['./jestSetup.js'],
    //^ Replaces the too verbose (4 lines per console log) jest console output with the plain one.
    //^ Requires to link with another file, cannot use function - lambda functions or function referances will give "TypeError: path.startsWith is not a function" error.
    ///moduleNameMapper: { "^src/code/(.+)\\.js$": "<rootDir>/src/code/$1.ts" },
};
