const path = require('path');

module.exports = {
  entry: './src/dropdown/dropdown.js',
  mode: 'production',
  output: {
    filename: 'dropdown.js',
    path: path.resolve(__dirname, 'lib'),
    library: 'vk_dropdown',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader',
      }, {
        test: /\.pcss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
};
