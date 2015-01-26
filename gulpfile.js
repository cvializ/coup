var gulp = require('./gulp')([
  'watchify'
]);

gulp.task('build', ['watchify']);
gulp.task('default', ['build', 'watch', 'serve', 'open']);
