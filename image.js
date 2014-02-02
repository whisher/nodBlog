var im = require('imagemagick');
im.resize({
  srcPath: './me2.jpg',
  dstPath: './me2-1.jpg',
  width:   256
}, function(err, stdout, stderr){
  if (err) throw err;
  console.log('resized kittens.jpg to fit within 256x256px');
});