const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer')
const imagemin = require('imagemin')
const imageminMozJpeg = require('imagemin-mozjpeg')
const imageminPngQuant = require('imagemin-pngquant')
const imageminSvgo = require('imagemin-svgo')
const imageminGifSicle = require('imagemin-gifsicle')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const upload = multer({
  storage: storage
}).array('file', 10);

app.use(cors())

app.post('/', upload, function (req, res) {

  imagemin(['./images/' + req.files[0].filename], './images', {
    plugins: [
      imageminGifSicle({ interlaced: true }),
      imageminMozJpeg(),
      imageminPngQuant({ quality: '85-100' }),
      imageminSvgo({ plugins: [{ removeViewBox: true }] })
    ]
  }).then(() => {
    res.send({
      ok: '/images/' + req.files[0].filename
    })
  })
})

app.listen(3050, function () {
  console.log('Example app listening on port 3050!')
})