const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 配置文件类型的解析
    alias: {
      'vue$': 'vue/dist/vue.esm.js', // 用于 Vue.js 2.x
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]', // 保持原始文件名和扩展名
              outputPath: 'images/', // 输出到指定目录
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: {
          loader: 'file-loader', // 或者使用 'url-loader'
          options: {
            name: 'fonts/[name].[ext]', // 输出到指定目录
          },
        },
      },
    ],
  },
  plugins: [],
};
