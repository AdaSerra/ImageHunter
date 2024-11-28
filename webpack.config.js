const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode:'development',
  entry: {
    content: './src/content.js',
    popup: './src/popup.js',
    background: './src/background.js',
    options: './src/options.js'

  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      template: './src/options.html',
      chunks: ['options']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: 'src/images',
         to: 'images'
        }
      ]
    })
  ],
  
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [ 
          { loader: 'file-loader', 
            options: { 
              name: '[path][name].[ext]', 
            }, 
          }
        ]
      }
    ]
  }
};
