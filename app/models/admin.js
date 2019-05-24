'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('boom');

const adminSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});

adminSchema.statics.findByEmail = function(email) {
    return this.findOne({ email : email});
};

adminSchema.methods.comparePassword = function(candidatePassword) {
    const isMatch = this.password === candidatePassword;
    if (!isMatch) {
        throw new Boom('Password mismatch');
    }
    return this;
};



module.exports = Mongoose.model('Admin', adminSchema);