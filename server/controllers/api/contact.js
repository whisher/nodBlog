'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Contact = mongoose.model('Contact'),
    mail = require('../../services/mail');
 
/**
 * Find comment by id
 */
exports.contact = function(req, res, next, id) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.jsonp(404,{
            error: 'Failed to load contact with id ' + id
        });
    }
    Contact.findById(id).exec(function (err, contact) {
        if (err) {
            return next(err);
        }
        if (!contact) {
            return res.json(404,{
                error: 'Failed to load contact ' + id
            });
        }
        req.contact = contact;
        next();
    });
};

/**
 * Create a contact
 */
exports.create = function(req, res) {
    var data = req.body;
    data.id = req.ip;
    data.referer = req.header('referer');
    var contact = new Contact(data);
    contact.save(function(err) {
        if (err) {
            return res.json(500,{
                error: 'Cannot save the contact'
            });
        }
        res.json(200,contact);
    });
    mail.addContactNotice(data.username,data.email,data.msg);
};

/**
 * List of contacts
 */
exports.all = function(req, res) {
    Contact.find().sort('-created').exec(function(err,contacts) {
        if (err) {
            return res.json(500,{
                error: 'Cannot get all the contacts'
            });
        }
        res.json(200,contacts);
    });
};

/**
 * Show a contact
 */
exports.show = function(req, res) {
    res.json(req.contact);
};