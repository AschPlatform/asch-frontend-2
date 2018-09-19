var gulp = require('gulp')
var replace = require('gulp-string-replace')
// development
// const dev = 'develop'
const serverUrls = {
  'localnet': 'http://localhost:4096',
  'mainnet': 'http://mainnet.asch.cn',
  'testnet': 'http://testnet.asch.io'
}
const magicStr = {
  'localnet': '594fe0f3',
  'mainnet': '5f5b3cf5',
  'testnet': '594fe0f3'
}

const runTask = (type) => {
  gulp.src('./src/utils/constants.js')
    .pipe(replace(new RegExp('serverUrl.*'), "serverUrl: '" + serverUrls[type] + "',"))
    .pipe(replace(new RegExp('magic.*', 'g'), "magic: '" + magicStr[type] + "',")).pipe(gulp.dest('./src/utils'))
}

gulp.task('localnet', () => {
  console.log('localnet..')
  runTask('localnet')
})
gulp.task('mainnet', () => {
  console.log('mainnet..')
  runTask('mainnet')
})
gulp.task('testnet', () => {
  console.log('testnet..')
  runTask('testnet')
})

gulp.task('default', ['localnet'])
