var gulp = require('gulp');
var less = require('gulp-less');
var babel = require('gulp-babel');
var webserver = require('gulp-webserver');
var url = require('url');
var fs = require('fs');
var miniHtml = require('gulp-htmlmin');
var minCss = require('gulp-minify-css');
var sequence = require('gulp-sequence');
gulp.task('testless', function() {
    gulp.src("src/css/style.less", { base: 'src/css' })
        .pipe(less())
        .pipe(minCss('style.min.css'))
        .pipe(gulp.dest('dist/css'))
});
gulp.task('miniH', function() {
    gulp.src('src/index.html')
        .pipe(miniHtml({
            collapseWhitespace: true, //压缩HTML
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest('dist'))
});
gulp.task('change', function() {
    gulp.watch('src/css/style.less', ['testless'])
});
gulp.task('server', function() {
    gulp.src('dist')
        .pipe(webserver({
            host: 'localhost',
            port: 8087,
            livereload: true, //实时更新
            open: true,
            middleware: function(req, res, next) { //拦截请求
                //req 请求
                //res 返回
                //next 执行下一个

                var pathname = url.parse(req.url).pathname;
                if (pathname === '/favicon.ico') { return; };
                if (pathname === '/page') {
                    res.writeHead(200, {
                        'Content-Type': 'text/html;charset=utf8'
                    })
                    res.end(fs.readFileSync('dist/index.html'));
                }
                next()
            }
        }))
});
gulp.task('default', ['testless', 'miniH', 'server'])