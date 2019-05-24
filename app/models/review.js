'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const reviewSchema = new Schema({
    review: String,
    bestFor: String,
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    island:{
        type: Schema.Types.ObjectId,
        ref: 'Island'
    },
});



module.exports = Mongoose.model('Review', reviewSchema);