const path = require('path');
const fs = require('fs');
const colors = require('colors');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log(`[ ${colors.green.bold('START')} ] Сборка проекта\n`);

const viewsPath = path.join('src', 'pages');
const views = fs.readdirSync(viewsPath);

console.log(`[ ${colors.blue.bold('PAGES')} ]`);

const pages = views.map(view => {
  console.log(`• http://localhost:3000/${view}.html`);
  return new HTMLWebpackPlugin({
    filename: `${view}.html`,
    template: `./src/pages/${view}/${view}.pug`
  });
});

console.log('');


module.exports = (env) => {
  const dev = env ? env.WEBPACK_SERVE : false;
  console.log(dev);
  return {
    entry: ['./src/app/build/common', './src/app/scss/main.scss'],
    output: {
      filename: !!dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
      path: path.resolve(__dirname, 'build'),
      publicPath: !!dev ? '/' : './'
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, './build')
      },
      compress: true,
      port: 3000,
    },
    devtool: dev && 'source-map',
    plugins: [
      ...pages,
      new MiniCssExtractPlugin({
        filename: !!dev ? 'css/[name].css' : 'css/[name].[chunkhash].css',
        chunkFilename: 'css/[id].css'
      }),
      new CleanWebpackPlugin()
    ],
    module: {
      rules: [{
          test: /\.pug$/,
          use: [{
              loader: 'html-loader'
            },
            {
              loader: 'pug-html-loader'
            },
          ]
        },
        {
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
              options: {
                sourceMap: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [
                    'autoprefixer'
                  ],
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  sourceMap: true,
                  sourceMapContents: false
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
      extensions: ['.ts', '.js', '.pug'],
    },
    target: ['web', 'es5'],
  }
};