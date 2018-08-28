var gulp = require('gulp')
var replace = require('gulp-string-replace')
// development
// const dev = 'develop'
const serverUrls = {
  'develop': 'http://localhost:4096',
  'production': 'http://mainnet.asch.cn',
  'test': 'http://testnet.asch.io'
}
const magicStr = {
  'develop': '594fe0f3',
  'production': '5f5b3cf5',
  'test': '5f5b3cf5'
}

const runTask = (type) => {
  gulp.src('./src/utils/constants.js')
    .pipe(replace(new RegExp('serverUrl.*'), "serverUrl: '" + serverUrls[type] + "',"))
    .pipe(replace(new RegExp('magic.*', 'g'), "magic: '" + magicStr[type] + "',")).pipe(gulp.dest('./src/utils'))
}

gulp.task('dev', () => {
  console.log('dev..')
  runTask('develop')
})
gulp.task('pro', () => {
  console.log('pro..')
  runTask('production')
})
gulp.task('test', () => {
  console.log('test..')
  runTask('test')
})

gulp.task('default', ['dev'])
