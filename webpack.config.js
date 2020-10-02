const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin      = require('html-webpack-plugin');
const MiniCssExtractPlugin   = require('mini-css-extract-plugin');
const { EnvironmentPlugin }  = require('webpack');


const prod = process.env.NODE_ENV === 'production';

module.exports = {

  /* BASE CONFIG */

  mode: prod
    ? 'production'
    : 'development',

  stats: {
    children: false,
    entrypoints: false,
    modules: false,
  },

  devtool: prod
    ? 'source-map'
    : 'cheap-module-eval-source-map',

  entry: path.resolve(__dirname, './src/index.jsx'),

  output:
  {
    path: path.resolve(__dirname, './dist'),
    publicPath: process.env.BASE_URL ?? '/',

    filename: prod
      ? '[name].[contenthash].js'
      : '[name].[hash].js',

  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@assets': path.resolve(__dirname, './src/assets/'),
      '@components': path.resolve(__dirname, './src/components/'),
      '@store': path.resolve(__dirname, './src/store/'),
    },
    extensions: ['.js', '.json', '.jsx' ],
  },

  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

  /* DEV SERVER */

  devServer: {
    clientLogLevel: 'warn',
    historyApiFallback: true,
    hot: true,
    inline: true,
    overlay: true,
    stats: 'minimal',
  },


  /* PLUGINS */

  plugins: [

    // Clean dist/ folder
    new CleanWebpackPlugin(),

    // Safe environment variables
    new EnvironmentPlugin({
      'NODE_ENV': 'development',
      'BASE_URL': '/',
    }),

    // Generate dist/index.html
    new HTMLWebpackPlugin({
      favicon: 'public/favicon.ico',
      template: path.join(__dirname, 'public/index.html'),
      title: process.env.APP_NAME ?? 'webpack',
    }),

    // Bundle styles in separate *.css files
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

  ],

  /* RULES */

  module: {

    rules: [

      // *.css
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !prod,
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            }
          }
        ],
      },

      // *.png
      {
        test: /\.png$/,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 },
        },
      },

      // *.svg
      {
        test: /\.svg$/,
        use: {
          loader: '@svgr/webpack',
        },
      },

      // *.jsx?
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

    ]
  }
};