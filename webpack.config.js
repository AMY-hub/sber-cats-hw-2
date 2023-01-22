const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ['./src/scripts/index.js', './src/styles/main.scss'],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, './build')
    },
    compress: true,
    port: 3000,
  },
  devtool: 'inline-source-map',
  plugins: [
    new HTMLWebpackPlugin({
      template: './public/index.html'
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [{
        test: /\.(js|ts)?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /.(sass|css|scss)$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer'
                ],
              }
            }
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                sourceMap: true,
                modules: true
              }
            }
          }
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        type: 'asset',
      },
      {
        test: /\.(jpg|png|svg)$/,
        type: 'asset/inline',
      },
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        corejsVendor: {
          test: /[\\/]node_modules[\\/](core-js)[\\/]/,
          name: 'vendor-corejs',
          chunks: 'all',
        },
      }
    }
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};