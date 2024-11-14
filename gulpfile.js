
// Если вылетает ошибка webp-converter - переустановить npm install webp-converter@2.2.3 --save-dev
let source_folder = "./src";
let project_folder = './build';

let path = {
  src: {
    html: [source_folder + "/*.html"],
    css: source_folder + "/css/**/*.scss",
    js: source_folder + "/js/**/_*.js",
    libs: source_folder + "/libs/**",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico}",
  },
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    libs: project_folder + "/libs/",
    img: project_folder + "/img/",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/css/**/*.scss",
    js: source_folder + "/js/**/*.js",
    libs: source_folder + "/libs/**",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico}",
  },
  clean: {
    build: "./" + project_folder + "/",
  }
}
let {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  webp = require('gulp-webp'),
  del = require('del'),
  rename = require('gulp-rename'),
  fileinclude = require('gulp-file-include'),
  typograf = require('gulp-typograf'),
  htmlMin = require('gulp-htmlmin'),
  sourcemaps = require('gulp-sourcemaps'),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  groupmedia = require('gulp-group-css-media-queries'),
  clean_css = require('gulp-clean-css'),
  uglify = require('gulp-uglify-es').default,
  babel = require('gulp-babel'),
  notify = require('gulp-notify'),
  avif = require('gulp-avif');
  ttf2woff = require('gulp-ttf2woff'),
  ttf2woff2 = require('gulp-ttf2woff2'),
  fonter = require('gulp-fonter'),
  gulp_if = require('gulp-if');
  imagemin = require('imagemin');
  imageminWebp = require('imagemin-webp');
  
//Запуск обработки production версии gulp --build, разработка по умолчанию gulp
// Устанавливает флаг для сборки product версии
let productFlag = false;

let setProductFlag = (done) => {
  productFlag = true;
  done();
};

// Очистка директории с build версией
const clean = () => {
  return del('build')
}

const browserSync = () => {
  browsersync.init({
    server: {
      baseDir: 'build',
    },
    port: 3000,
    notify: false,
  })
}

// Обирает все компоненты @html в один файл, текст обрабатывается типографом
const processHtml = () => {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(typograf({
      locale: ['ru', 'en-US']
    }))
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

// Минификация html
const minifyHtml = () => {
  return src(`${path.build.html}**/*.html`)
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(dest(path.build.html));
}

const processCss = () => {
  return src('src/css/**/*.css')
    .pipe(groupmedia())
    .pipe(autoprefixer({
      overrideBrowserslist: [
        "last 5 version",
        "> 1%",
        "IE 10",
      ],
      cascade: true,
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

const processScss = () => {
  return src('src/css/**/*.scss')
    .pipe(scss({outputStyle: "compressed"}).on('error', scss.logError))
    .pipe(groupmedia())
    .pipe(autoprefixer({
      overrideBrowserslist: [
        "last 5 version",
        "> 1%",
        "IE 10",
      ],
      cascade: true,
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

// Минификация css
const minifyCss = () => {
  return src('src/css/**/*.css')
    .pipe(clean_css({
      level:
      {
        2: {
          specialComments: 0
        }
      }
    }))
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

const processJs = () => {
  return src('src/js/**/*.js')
    .pipe(fileinclude())
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    .pipe(dest('build/js'))
    .pipe(browsersync.stream())
}

// Минификация JavaScript
const minifyJs = () => {
  return src(`src/js/**/*.js`)
    // .pipe(babel({
    //   presets: ['@babel/env']
    // }))
    .pipe(uglify({ toplevel: true }).on('error', notify.onError()))
    .pipe(dest('build/js'))
}

const processImages = () => {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

const minfiyImages = () => {
  return src([`${source_folder}/img/**/*.{jpg,jpeg,png,webp}`])
    .pipe(imagemin())
    .pipe(dest(path.build.img))
};
const processFonts = () => {
  return src('src/fonts/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(dest('build/fonts/'))
    .pipe(src('src/fonts/**/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('build/fonts/'))
}

const watchFiles = () => {
  gulp.watch([path.watch.html], processHtml)
  gulp.watch([path.watch.css], processCss)
  gulp.watch(['src/css/**/*.scss'], processScss)
  gulp.watch([path.watch.js], processJs)
  gulp.watch([path.watch.img], processImages)
}

exports.default = gulp.series(
  clean,
  processFonts,
  gulp.parallel(
    processHtml,
    processJs,
    processCss,
    processScss,
  ),
  gulp.parallel(
    processImages,
  ),
  gulp.parallel(
    watchFiles,
    browserSync,
  ),
);