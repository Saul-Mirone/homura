const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'homura',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './config/webpack/webpack.main.config.js',
        renderer: {
          config: isProd
            ? './config/webpack/webpack.renderer.config.prod.js'
            : './config/webpack/webpack.renderer.config.dev.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/index.tsx',
              name: 'main_window',
              prefixedEntries: isProd ? [] : ['react-hot-loader/patch'],
            },
          ],
        },
      },
    ],
  ],
};
