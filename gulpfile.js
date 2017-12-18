/*!
 * gulp
 * $
  cnpm install  gulp gulp-sftp --save-dev
 */
// 加载各个模块
var gulp = require('gulp'),
    sftp = require('gulp-sftp')
gulp.task('deploy', function () {
    /**  test */
    // var _conf = {
    //     host: '47.94.231.168',
    //     remotePath: '/home/wwwroot/default/case/hxmsc',
    //     user: 'root',
    //     pass: '@Flan010scmmf5bl'
    // }
    /**正式 */
    var _conf = {
        host: '101.37.70.47',
        remotePath: '/home/wwwroot/default/hyan_weixin/public/pages/h5/2017/0815',
        user: 'root',
        pass: '@Flan010yanhao'
    }
    return gulp.src('build/**')
        .pipe(sftp(_conf))
})