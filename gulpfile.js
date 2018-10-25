"use strict";

var fs = require("fs");
var gulp = require("gulp");
var path = require("path");
var argv = require("yargs").argv;
var browserSync = require("browser-sync").create();
var Karma = require("karma").Server;
var runSequence = require("run-sequence");
var $ = require("gulp-load-plugins")();

var dirTree = require("directory-tree");

var walk = (dir, transform, done) => {
  var results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, transform, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          file = transform(file);
          if (file) {
            results.push(file);
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

gulp.task("js", () => {
  return (
    gulp
      .src(["./dev/js/*.js", "./dev/js/!(vendor)/*.js"])
      //.pipe($.plumber())
      //.pipe(
        //$.babel({
          //presets: ["es2015"],
          //minified: true,
          //comments: false,
          //compact: true
          // plugins: [
          //   'transform-es2015-for-of'
          // ]
       // })
      //)
      // .pipe($.uglify())
      .pipe(gulp.dest("./docs/js"))
  );
});

gulp.task("js:vendorBundle", () => {
  return gulp
    .src(["./dev/js/vendor/**/!(require).js"])
    .pipe($.concat("vendor.js"))
    .pipe(gulp.dest("./docs/js"))
    .pipe(gulp.dest("./dev/js"));
});

gulp.task("js:bundle", ["js:vendorBundle"], () => {
  return gulp
    .src([
      "./dev/js/migrate.js",
      "./dev/js/components/**/*.js",
      "./dev/js/i18n/**/*.js",
      "./dev/js/libs/**/*.js",
      "./dev/js/templates/**/*.js",
      "./dev/js/modules/**/*.js",
      "./dev/js/app.js"
    ])
    .pipe($.concat("bundle.js"))
    .pipe(
      $.babel({
        presets: ["es2015"],
        minified: true,
        comments: false,
        compact: true
      })
    )
    .pipe(gulp.dest("./docs/js"))
    .pipe(gulp.dest("./dev/js"));
});

gulp.task("vendor", () => {
  return gulp
    .src("./dev/js/vendor/**/*.js")
    .pipe(gulp.dest("./docs/js/vendor"));
});

gulp.task("css", () => {
  return (
    gulp
      .src([
        "./dev/stylus/rupture.styl",
        "./dev/stylus/vars.styl",
        "./dev/stylus/mixins.styl",
        "./dev/stylus/reset.styl",
        "./dev/stylus/layout.styl",
        "./dev/stylus/text.styl",
        "./dev/stylus/forms/*.styl",
        "./dev/stylus/banners/*.styl",
        "./dev/stylus/blocks/**/*.styl",
        "./dev/stylus/modal/*.styl",
        "./dev/stylus/plugins/*.styl"
      ])
      .pipe($.plumber())
      // .pipe($.sourcemaps.init())
      .pipe($.concat("style.styl"))
      .pipe($.replace(/\&\:(hover|active)/gi, "html.no-mobile &:$1"))
      .pipe($.stylus())
      .pipe(
        $.autoprefixer({
          browsers: [
            "> 1%",
            "last 5 versions",
            "Android >= 3",
            "Firefox ESR",
            "Opera 12.1"
          ]
        })
      )
      // .pipe($.sourcemaps.write())
      .pipe($.groupCssMediaQueries())
      .pipe(gulp.dest("./docs/css"))
      .pipe(browserSync.stream())
  );
});

gulp.task("css:loader", ["css"], () => {
  return gulp
    .src("./dev/css/blocks/page-loader.css")
    .pipe($.plumber())
    .pipe($.cssnano())
    .pipe($.rename("page-loader.min.css"))
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("css:split", () => {
  return gulp
    .src("./docs/css/style.css")
    .pipe($.plumber())
    .pipe(
      $.sakugawa({
        maxSelectors: 4000,
        mediaQueries: "separate",
        suffix: ".part"
      })
    )
    .pipe($.cssnano())
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("css:min", ["css:loader", "css:split"], () => {
  return gulp
    .src("./docs/css/style.css")
    .pipe($.plumber())
    .pipe($.cssnano())
    .pipe($.rename("style.min.css"))
    .pipe(gulp.dest("./docs/css"));
});

gulp.task("css2", () => {
  return (
    gulp
      .src("./dev/stylus/**/*.styl")
      .pipe($.plumber())
      // .pipe($.sourcemaps.init())
      .pipe($.changedInPlace())
      .pipe(
        $.stylus({
          import: [
            __dirname + "/dev/stylus/rupture.styl",
            __dirname + "/dev/stylus/vars.styl",
            __dirname + "/dev/stylus/mixins.styl"
          ]
        })
      )
      .pipe(
        $.autoprefixer({
          browsers: [
            "> 1%",
            "last 5 versions",
            "Android >= 3",
            "Firefox ESR",
            "Opera 12.1"
          ]
        })
      )
      // .pipe($.sourcemaps.write())
      .pipe(gulp.dest("./dev/css"))
      .pipe(browserSync.stream())
  );
});

gulp.task("css:nocache", () => {
  return gulp
    .src("./dev/stylus/**/*.styl")
    .pipe($.plumber())
    .pipe(
      $.stylus({
        import: [
          __dirname + "/dev/stylus/rupture.styl",
          __dirname + "/dev/stylus/vars.styl",
          __dirname + "/dev/stylus/mixins.styl"
        ]
      })
    )
    .pipe(
      $.autoprefixer({
        browsers: [
          "> 1%",
          "last 5 versions",
          "Android >= 3",
          "Firefox ESR",
          "Opera 12.1"
        ]
      })
    )
    .pipe(gulp.dest("./dev/css"))
    .pipe(browserSync.stream());
});

gulp.task("eslint", () => {
  browserSync.reload();
  // return gulp.src('./dev/js/**/*.js')
  //   .pipe($.plumber())
  //   .pipe($.changedInPlace())
  //   .pipe($.eslint({
  //     parserOptions: {
  //       ecmaVersion: 6
  //     },
  //     globals: [
  //       'requirejs',
  //       'require',
  //       'define',
  //       'App',
  //       'Promise'
  //     ],
  //     rules: {
  //       'semi': ['error', 'never'],
  //       'indent': [2, 2, {"SwitchCase": 1}],
  //       'no-console': 1
  //     }
  //   }))
  //   .pipe($.eslint.results(function (results) {
  //     browserSync.sockets.emit('msg:eslint', results)
  //   }))
  //   .pipe($.eslint.format())
  //   .pipe($.eslintThreshold.afterErrors(0, function (numberOfErrors) {
  //     if (numberOfErrors === 0) {
  //       browserSync.reload()
  //     }
  //   }))
});

gulp.task("img", () => {
  return gulp
    .src("./dev/img/**/*.+(jpg|png|svg)")
    .pipe($.plumber())
    .pipe($.changed("./docs/img"))
    .pipe(gulp.dest("./docs/img"));
});

gulp.task("temp", () => {
  return gulp
    .src("./dev/temp/**/*.*")
    .pipe($.plumber())
    .pipe($.changed("./docs/temp"))
    .pipe(gulp.dest("./docs/temp"));
});

gulp.task("svgmin", () => {
  return gulp
    .src("./dev/img/**/*.svg")
    .pipe($.plumber())
    .pipe($.changed("./docs/img"))
    .pipe($.svgmin())
    .pipe(
      $.cheerio({
        run: $ => {
          $("title").remove();
        },
        parserOptions: {
          xmlMode: true
        }
      })
    )
    .pipe(gulp.dest("./docs/img"));
});

gulp.task("json", () => {
  gulp.src("./dev/json/**/*.json").pipe(gulp.dest("./docs/json"));
});

gulp.task("modals", () => {
  gulp
    .src("./dev/pug/modal/*.pug")
    .pipe($.plumber())
    .pipe(
      $.pug({
        basedir: path.join(__dirname, "dev", "pug")
      })
    )
    .pipe($.prettify())
    .pipe(gulp.dest("./docs/modal"));
});

gulp.task("html", () => {
  walk(
    path.join(__dirname, "dev/stylus"),
    file => {
      file = file.replace(path.join(__dirname, "dev/stylus/"), "");
      if (path.extname(file) === ".styl" && /\//.test(file)) {
        return "css/" + file.replace(".styl", ".css");
      }
      return null;
    },
    (err, results) => {
      let files = [];

      if (argv.files) {
        let passed = argv.files.split(",");

        for (let name of passed) {
          files.push(`./dev/${name}.pug`);
        }
      } else {
        files.push("./dev/*.pug");
      }

      gulp
        .src(files)
        .pipe($.plumber())
        .pipe(
          $.debug({
            title: "compiled"
          })
        )
        .pipe(
          $.data(file => {
            return {
              pagename: path.basename(file.path, ".pug"),
              css: results,
              env: "prod"
            };
          })
        )
        .pipe(
          $.pug({
            basedir: path.join(__dirname, "dev", "pug")
          })
        )
        .pipe(
          $.prettify({
            indent_size: 1,
            indent_char: "\t"
          })
        )
        // .pipe($.useref())
        // .pipe($.inlineSource({
        //   compress: true,
        //   rootpath: path.resolve('./docs'),
        // }))
        .pipe(
          $.cheerio({
            run: $ => {
              $("svg").each(function() {
                $(this).html(
                  $(this)
                    .html()
                    .replace(/>\s+</gi, "><")
                );
              });
            },
            parserOptions: {
              withDomLvl1: false,
              decodeEntities: false
            }
          })
        )
        .pipe(gulp.dest("./docs"));
    }
  );
});


gulp.task('sprite:build', () => {
  return gulp.src('./dev/svg/**/*.svg')
    .pipe($.plumber())
    .pipe($.rename(path => {
      var name = path.dirname.split(path.sep)
      name.push(path.basename)
      if (path.dirname !== '.') {
        path.basename = name.join('__').replace(/\//gi, '-')
      }
      path.basename = 'ico_' + path.basename
    }))
    .pipe($.svgmin())
    .pipe($.svgstore())
    .pipe($.cheerio({
      run: $ => {
        var needlessEls = ['title', 'style']
        var needlessAttrs = ['fill', 'style', 'class', 'stroke', 'opacity']

        for (var el of needlessEls) {
          $(el).remove()
        }
        for (var attr of needlessAttrs) {
          $(`[${attr}]`).removeAttr(attr)
        }
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe($.rename('sprite.svg'))
    .pipe(gulp.dest('./docs/img'))
})

gulp.task('sprite', () => {
  runSequence(
    'sprite:build',
  )
})

gulp.task("build", () => {
  runSequence(
    ["img", "vendor", "temp"],
    ["css:min", "modals", "js"],
    ["js:bundle", "html"],
    ['sprite']
  );
});

gulp.task("karma", done => {
  new Karma(
    {
      configFile: __dirname + "/karma.conf.js"
    },
    done
  ).start();
});

gulp.task("nodemon", cb => {
  var started = false;

  return $.nodemon({
    script: "server.js",
    ignore: ["./.gulp", "./docs", "./dev"]
  }).on("start", () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task("browser-sync", ["nodemon"], () => {
  browserSync.init(null, {
    proxy: "https://localhost:3501",
    httpModule: "spdy",
    https: {
      key: "server.key",
      cert: "server.crt"
    },
    port: 3500,
    reloadDebounce: 200,
    notify: false,
    open: false,
    plugins: ["bs-eslint-message"]
  });
});

var defaultTasks = ["browser-sync", "css2", "eslint"];

if (argv.test) {
  defaultTasks.push("karma");
}

gulp.task("default", defaultTasks, () => {
  gulp.watch("./dev/stylus/**/*.styl", ["css2"]);
  gulp.watch("./dev/js/**/*.js", ["eslint"]);
  gulp.watch(["./dev/**/*.pug"]).on("change", browserSync.reload);
});
