const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './src/js/main.js',
    about: './src/js/about.js',
    solution: './src/js/solution.js',
    contact: './src/js/contact.js',
    work: './src/js/work.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: 'about.html',
      filename: 'about.html',
      chunks: ['about'],
    }),
    new HtmlWebpackPlugin({
      template: 'solution.html',
      filename: 'solution.html',
      chunks: ['solution'],
    }),
    new HtmlWebpackPlugin({
      template: 'work.html',
      filename: 'work.html',
      chunks: ['work'],
    }),
    new HtmlWebpackPlugin({
      template: 'contact.html',
      filename: 'contact.html',
      chunks: ['contact'],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'src/image', to: 'src/image' }],
    }),
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
