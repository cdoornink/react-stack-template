/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */

import gulp from 'gulp';
import babel from 'gulp-babel';
import del from 'del';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import webpack from 'webpack-stream';
import webserver from 'gulp-webserver';
import webpackConfig from './webpack.config.babel';


const paths = {
  allSrcJs: 'src/**/*.js?(x)',
  serverSrcJs: 'src/server/**/*.js?(x)',
  sharedSrcJs: 'src/shared/**/*.js?(x)',
  clientEntryPoint: 'src/client/app.jsx',
  clientBundle: 'dist/client-bundle.js?(.map)',
  clientStylesBundle: 'dist/client-bundle.css?(.map)',
  gulpFile: 'gulpfile.babel.js',
  webpackFile: 'webpack.config.babel.js',
  libDir: 'lib',
  distDir: 'dist',
  watchedStyles: 'src/client/styles/**/*.scss',
  appStyle: 'src/client/styles/app.scss',
};

gulp.task('sass', ['cleanCSS'], () =>
  gulp.src(paths.appStyle)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(paths.distDir))
);

gulp.task('lint', () =>
  gulp.src([
    paths.allSrcJs,
    paths.gulpFile,
    paths.webpackFile,
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

gulp.task('cleanJS', () => del([paths.libDir, paths.clientBundle]));
gulp.task('cleanCSS', () => del([paths.clientStylesBundle]));

gulp.task('js', ['lint', 'cleanJS'], () =>
  gulp.src(paths.allSrcJs)
    .pipe(babel())
    .pipe(gulp.dest(paths.libDir))
);

gulp.task('main', ['js', 'sass'], () =>
  gulp.src(paths.clientEntryPoint)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(paths.distDir))
);

gulp.task('watch', () => {
  gulp.watch(paths.allSrcJs, ['main']);
  gulp.watch(paths.watchedStyles, ['sass']);
});

gulp.task('webserver', () => {
  gulp.src(paths.distDir)
    .pipe(webserver({
      livereload: true,
    }));
});

gulp.task('default', ['webserver', 'watch', 'main']);
