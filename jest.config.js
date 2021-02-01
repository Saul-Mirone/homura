module.exports = {
    testURL: 'http://localhost/',
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/config/test/FileMock.js',
        '\\.(css|pcss)$': 'identity-obj-proxy',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
    transform: {
        '\\.[jt]sx?$': 'babel-jest',
    },
    moduleDirectories: ['node_modules'],
    setupFilesAfterEnv: ['<rootDir>/config/test/SetupTest.js'],
};
