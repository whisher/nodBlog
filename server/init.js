'use strict';

var fs = require('fs'),
    utilsFs = require('./lib/utils/fs')(fs),
    upload = __dirname + '/../client/upload',
    tmp = __dirname + '/tmp';
    
utilsFs.mkdirSync(upload,484);
utilsFs.mkdirSync(tmp,484);
    

 

    