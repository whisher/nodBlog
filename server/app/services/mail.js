var mandrill = require('node-mandrill')('-eto0RYfFJvoP1cZ8P1P0g');

exports.addCommentNotice = function(userEmail,postId,data) {
    mandrill('/messages/send', {
        message: {
            to: [{email: 'whisher06@gmail.com', name: 'Yasin'}],
            from_email: userEmail,
            subject: 'Add comment to post '+postId,
            text: data
        }
    }, 
    function(error, response){
        //uh oh, there was an error
        if (error){ 
            console.log( JSON.stringify(error) );
            return;
        }
        //everything's good, lets see what mandrill said
        console.log(response);
    });
}