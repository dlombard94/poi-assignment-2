'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;


const pictureSchema = new Schema({
    title: String,
    img: String,
    island:{
        type: Schema.Types.ObjectId,
        ref: 'Island'
    },
});



module.exports = Mongoose.model('Picture', pictureSchema);