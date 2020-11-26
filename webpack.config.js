const { basename, join, resolve } = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin      = require('copy-webpack-plugin');
const HTMLWebpackPlugin      = require('html-webpack-plugin');
const MiniCssExtractPlugin   = require('mini-css-extract-plugin');
const SpriteLoaderPlugin     = require('svg-sprite-loader/plugin');
const { EnvironmentPlugin }  = require('webpack');


// Declare whether we are in a production environment
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

  entry: resolve(__dirname, './src/index.jsx'),

  output:
  {
    path: resolve(__dirname, './dist'),
    publicPath: process.env.BASE_URL || '/',

    filename: prod
      ? '[name].[contenthash].js'
      : '[name].[hash].js',

  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/'),
      '@assets': resolve(__dirname, './src/assets/'),
      '@components': resolve(__dirname, './src/components/'),
      '@store': resolve(__dirname, './src/store/'),
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
        }
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

    new CopyWebpackPlugin({
      patterns: [
        { from: 'static', to: 'static' },
      ],
    }),

    // Safe environment variables
    new EnvironmentPlugin({
      'NODE_ENV': 'development',
      'BASE_URL': '/',
      'PRELOAD_CAPTIONS': process.env.PRELOAD_CAPTIONS || null,
      'PRELOAD_DATA': process.env.PRELOAD_DATA         || null,
      'PRELOAD_IMAGE': process.env.PRELOAD_IMAGE       || null,
      'PRELOAD_PLOTS': process.env.PRELOAD_PLOTS       || null,
    }),

    // Generate dist/index.html
    new HTMLWebpackPlugin({
      favicon: 'public/favicon.ico',
      template: join(__dirname, 'public/index.html'),
      title: process.env.APP_NAME || 'webpack',
    }),

    // Bundle styles in separate *.css files
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    // Bundle SVG sprites in separate module files
    new SpriteLoaderPlugin({
      plainSprite: true,
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
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
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

      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true,
              symbolId: '[name]',
              spriteFilename: (svgPath) => `${basename(svgPath)}`
            }
          },
        ],
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