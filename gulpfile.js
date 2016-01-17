var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    less = require('gulp-less'),
    plumber = require('gulp-plumber'),
    path = require('path'),
    beep = require('beepbeep'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

var onError = function (err) {
    beep();
    console.log(err);
};

gulp.task('styles', function() {
    gulp.src('less/global.less')
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('html', function() {
    gulp.src('index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(''))
        .pipe(notify({ message: 'Html task for index complete' }));

    gulp.src('thankyou.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(''))
        .pipe(notify({ message: 'Html task for thankyou complete' }));
});

gulp.task('javaScript', function() {
    return gulp.src('js/main.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('js'))
        .pipe(notify({ message: 'javaScript task complete' }));
});

gulp.task('images', function() {
    return gulp.src('images/*.png')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('images/compressed'))
        .pipe(notify({ message: 'Image task complete' }));
});

gulp.task('default', ['build', 'watch']);

gulp.task('build', ['styles', 'html', 'javaScript', 'images']);

gulp.task('watch', function() {
  gulp.watch('less/*.less', ['styles']);
  gulp.watch('*.html', ['html']);
  gulp.watch('js/*.js', ['javaScript']);
});

