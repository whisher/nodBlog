'use strict';

var mandrill = require('node-mandrill')('-eto0RYfFJvoP1cZ8P1P0g');

var emailTo = 'whisher06@gmail.com',
    nameTo = 'Yasin',
    website = 'ilwebdifabio.it';
    
exports.addCommentNotice = function(userEmail,postId,data) {
    mandrill('/messages/send', {
        message: {
            to: [{email: emailTo, name: nameTo}],
            from_email: userEmail,
            subject: 'Add comment to post '+postId,
            html: '<div>' + data + '</div>',
            metadata: {
                website: website
            }
        }
    },
    function(error, response){
        //uh oh, there was an error
        if (error){
            console.log(JSON.stringify(error));
            return;
        }
        //everything's good, lets see what mandrill said
        console.log(response);
    });
};

exports.addContactNotice = function(username,email,msg) {
    mandrill('/messages/send', {
        message: {
            to: [{email: emailTo, name: nameTo}],
            from_email: email,
            subject: 'Add contact to nodblog',
            html: '<div><b>'+username + '</b></div><div>' + email + '</div><div>' + msg + '</div>',
            metadata: {
                website: website
            }
        }
    },
    function(error, response){
        //uh oh, there was an error
        if (error){
            console.log(JSON.stringify(error));
            return;
        }
        //everything's good, lets see what mandrill said
        console.log(response);
    });
};