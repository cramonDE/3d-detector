// 0.导入需要的资源包
const Koa = require('koa');
const app = new Koa();
const serve = require('koa-static');
const path = require('path')

// 1.主页静态网页 把静态页统一放到public中管理
const home   = serve(path.join(__dirname)+'/dist/');
// 2.hello接口

// 3.分配路由
app.use(home); 
app.listen(3000);
