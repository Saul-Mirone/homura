const path = require('path');

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: path.resolve(__dirname, '..', 'src/main.ts'),
  // Put your normal webpack config below here
  module: {
    // eslint-disable-next-line global-require
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  externals: ['better-sqlite3'],
};
