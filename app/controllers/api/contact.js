'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contact = mongoose.model('Contact');
    
 /**
 * Create a contact
 */
exports.create = function(req, res) {
    console.log(req.body);
    console.log(req.ip);
    var contact = new Contact(req.body);
    contact.save(function(err) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
               return res.json(500,{ error: err.errors[errs[0]].message }); 
            }
            return res.json(500,{ error: 'Cannot save the contact' });
        } 
        res.json(200,contact);
    });  
};

/**
 * List of contacts
 */
exports.all = function(req, res) {
    Contact.find().sort('-created').exec(function(err,contacts) {
        if (err) {
            var errs = Object.keys(err.errors);
            if (errs.length > 0){
                return res.json(500,{
                    error: err.errors[errs[0]].message
                }); 
            }
            return res.json(500,{
                error: 'Cannot get all the contacts'
            });
        } 
        res.json(200,contacts);
    });
};
