'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const islandSchema = new Schema({
    name: String,
    area: Number,
    category: String,
    description: String,
    location: {
      longitude: Number,
      latitude: Number,
    },
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    pictures: [],
});


module.exports = Mongoose.model('Island', islandSchema);