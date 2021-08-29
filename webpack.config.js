const path = require('path')
//user-agent ，把浏览器的useragent变成一个对象
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  context: process.cwd(), // 上下文目录，当前目录
  mode: "development",
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'monitor.js'
  },
  devServer:{
    //静态资源目录
    contentBase: path.resolve(__dirname,'dist'),
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head', //注入html头部
    })
  ]


}