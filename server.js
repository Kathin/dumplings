var fs = require('fs');
var path = require('path');
var spdy = require('spdy');
var express = require('express');

var app = express();

app.set('views', path.join(__dirname, 'dev'));
app.set('view engine', 'pug');

app.locals.pretty = true;
app.locals.basedir = path.join(__dirname, 'dev', 'pug');

app.get('/', function (req, res, next) {
  var body = '';

  body += '<style>';
  body += 'body{font:16px Arial; padding:30px;}';
  body += 'a{color:CornflowerBlue;}';
  body += 'a:hover{color:LightSkyBlue;text-decoration:none;}';
  body += 'h1 i{font-weight:normal;font-size:18px;}';
  body += '</style>';
  body += '<h1>arline</h1>';

  fs.readdir(path.join(__dirname, 'dev'), (err, files) => {
    files.forEach(file => {
      if (path.extname(file) === '.pug') {
        body += '<p><a href="/' + path.basename(file, '.pug') + '">' + path.basename(file, '.pug') + '</a></p>'
      }
    });

    res.send(body);
  });
});


app.get(/^\/(json|css|js|img|temp)\/.+$/, function(req, res, next) {
  if (/\/css\/img/.test(req.path)) {
    return res.redirect(301, req.path.replace('/css', ''));
  }

  var dir = (
    // path.extname(req.path) === '.css' ||
    path.basename(req.path, '.svg') === 'sprite') ?
      'build' :
      'dev';
  var file = path.join(__dirname, dir, req.path);

  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.sendStatus(404);
  }
});

app.post(/^\/(json)\/.+$/, function(req, res, next) {
  var file = path.join(__dirname, 'dev', req.path);

  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.sendStatus(404);
  }
});

app.get('/fonts/:file.:ext', function(req, res, next) {
  var file = path.format({
    root: path.join(__dirname, 'dev', 'fonts/'),
    name: req.params.file,
    ext: `.${req.params.ext}`
  });

  if (fs.existsSync(file)) {
    res.sendFile(file);
  } else {
    res.sendStatus(404);
  }
});

app.get(/^\/(modal)\/.+\.html$/, function(req, res, next) {
  var file = path.format({
    root: path.join(__dirname, 'dev', 'pug'),
    name: req.path.replace('.html', ''),
    ext: '.pug'
  });

  if (fs.existsSync(file)) {
    res.render(file);
  } else {
    res.sendStatus(404);
  }
});

app.get('*', function(req, res, next) {
  var file = path.format({
    root: path.join(__dirname, 'dev'),
    name: req.path,
    ext: '.pug'
  });

  var walk = function(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
      if (err) return done(err);
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            file = file.replace(path.join(__dirname, 'dev', 'stylus'), '');
            if (path.extname(file) === '.styl' && /(\/|\\)/.test(file)) {
              results.push(path.normalize('css' + file.replace('.styl', '.css')).replace(/\\/gi, '/'));
            }
            if (!--pending) done(null, results);
          }
        });
      });
    });
  };

  if (fs.existsSync(file)) {
    walk(path.join(__dirname, 'dev', 'stylus'), function (err, results) {
      res.render(path.basename(file), {
        pagename: path.basename(file, '.pug'),
        css: results,
        env: 'dev'
      });
    });
  } else {
    res.send('Not found.');
  }
});

spdy
  .createServer({
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
  }, app)
  .listen(3501, (error) => {
    if (error) {
      console.error(error)
      return process.exit(1)
    }
  });
