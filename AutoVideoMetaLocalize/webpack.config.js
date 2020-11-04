// dependencies
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackCli = require('webpack-cli'); // added to clear dependency check

// https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
const ThemeOverrides = {
  //'primary-color': '#d8412f',
  //'font-size-base': '16px',
  //'@layout-header-background': '#FFF'
};

// webpack method
module.exports = {
  mode: 'development',
  devtool: 'source-map',

  entry: [
    require('regenerator-runtime/path').path,
    './client/src/components/App/App.tsx',
    './client/src/style/index.less',
  ],

  output: {
    path: path.resolve(__dirname, 'wwwroot'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.html', '.js', '.jsx', '.ts', '.tsx', '.css', '.less'],
  },

  devServer: {
    contentBase: path.resolve(__dirname, 'wwwroot'),
    writeToDisk: true,
  },

  module: {
    rules: [{
      test: /\.html$/,
      use: ['html-loader'],
    }, {
      test: /\.(c|le)ss$/,
      use: [
        MiniCssExtractPlugin.loader, // creates style nodes from JS strings
        'css-loader',
        { // translates CSS into CommonJS
          loader: 'less-loader', // compiles Less to CSS
          options: {
            modifyVars: ThemeOverrides, // override the default antd theme
            javascriptEnabled: true,
          },
        },
      ],
    }, {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        'babel-loader',
        // use eslint-loader to enforce an eslint code style as a build requirement
      ],
    }, {
      test: /\.(png|svg|jpg)$/,
      use: [{
        loader: 'file-loader',
        options:
        {
          esModule: false,
          outputPath: 'images/',
          publicPath: 'images/',
        },
      }],
    }],
  },

  plugins: [
    // creates style nodes from JS strings
    new MiniCssExtractPlugin({
      // filename: '[name].css',
      // chunkFilename: '[id].css',
    }),

    // adds a .html file as an entry point
    // and automatically attaches optimized outputs
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/index.html'),
      favicon: path.resolve(__dirname, 'client/favicon.ico'),
    }),

    // removes the build directory before rebuild
    new CleanWebpackPlugin(),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      // minify javascript using terser
      new TerserPlugin(),

      // minify css assets using cssnano
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
      }),
    ],
  },
};
