var im = require('imagemagick');

im.crop({
  srcPath:  './me1.jpg',
  dstPath: './me1-1cn.jpg',
  width: 256,
  height: 100,
  quality: 1,
  gravity: "North"
}, function(err, stdout, stderr){
  // foo
});