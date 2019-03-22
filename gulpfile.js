let path = require('path')
let gulp = require('gulp')
let cleanCSS = require('gulp-clean-css')
let cssWrap = require('gulp-css-wrap')
// gulp.task('css-wrap', function () {
//   return gulp.src(path.resolve('./theme/index.css'))
//   /* 找需要添加命名空间的css文件，支持正则表达式 */
//     .pipe(cssWrap({
//       selector: '.theme-95262b' /* 添加的命名空间 */
//     }))
//     .pipe(cleanCSS())
//     .pipe(gulp.dest('/path-assets/style/theme/95262b')) /* 存放的目录 */
// })
gulp.task('css-wrap', function () {
  return gulp.src(path.resolve('./⁨src⁩/⁨theme⁩/⁨498048⁩/index.css'))
  /* 找需要添加命名空间的css文件，支持正则表达式 */
    .pipe(cssWrap({
      selector: '.theme-498048⁩' /* 添加的命名空间 */
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('home/adminuser/zos/zos-web/src/⁨theme⁩⁨/assets⁩/⁨style⁩/theme/498048⁩')) /* 存放的目录 */
})
// gulp css-wrap
