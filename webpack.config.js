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
    contentBase: path.resolve(__dirname,'dist'),//devServer静态资源根目录
    //before 是用来配置路由的 express服务器
    before(router){
      router.get('/success',function(req,res){
        res.json({id:1}) //200
      })
      router.post('/error',function(req,res){
        res.sendStatus(500) //500
      })
    }
  },
  plugins:[
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'head', //注入html头部
    })
  ]


}