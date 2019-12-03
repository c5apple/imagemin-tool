const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const jimp = require('jimp');
const fs = require('fs');

// 画像圧縮
const MAX_WIDTH = (process.argv.length > 2) ? process.argv[2] : 975;
const QUALITY = 50;

fs.readdir('dist', (err, files) => {
  if (err) throw err;

  files.forEach((file) => {
    fs.unlinkSync('dist/' + file);
  });
});

fs.readdir('src', (err, files) => {
  if (err) throw err;

  // リサイズ
  files.filter(file => !file.match(/\.gif$/)).forEach((file) => {
    jimp.read('src/' + file).then((lenna) => {
      return lenna
        .resize(Math.min(MAX_WIDTH, lenna.getWidth()), jimp.AUTO)
        // .quality(QUALITY)
        .writeAsync('dist/' + file);
    }).catch((err) => {
      throw err;
    }).finally(() => {
      // 圧縮
      // imagemin(['dist/*.{jpg,JPG,png,gif,svg}'], 'dist', {
      imagemin(['dist/' + file], 'dist', {
        plugins: [
          imageminMozjpeg({ quality: 80 }),
          imageminPngquant({ quality: [0.65, 0.8] }),
          imageminGifsicle(),
          imageminSvgo()
        ]
      }).then(() => {
        console.log('Images optimized:', file);
      });
    });
  });
});
