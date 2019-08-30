const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        loader: 'postcss-loader?parser=postcss-scss',
        options: {
          ident: 'postcss',
          plugins: () => [require('postcss-short')()],
        },
      },
    ],
  },
  plugins: [
    new WebpackNotifierPlugin({
      alwaysNotify: false,
      title: 'App Name',
      contentImage: path.join(__dirname, 'image.png'),
    }),
  ],
};
