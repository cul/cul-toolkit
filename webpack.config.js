const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  performance: {
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000
  },
  entry: './src/index.js',
  output: {
    filename: 'js/cul-toolkit.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(css|sass|scss)$/,
        use: [
            MiniCssExtractPlugin.loader, // saves all css into a single file (instead of loading inline via "style-loader")
            "css-loader", // translates CSS into CommonJS
            "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.ico$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
        filename: "css/cul-toolkit.css"
    }),
    new CopyWebpackPlugin([
        { from: 'static', to: '.' },
    ])
  ],
  externals: {
    jquery: "jQuery",
    "$": "jQuery",
  }
};
