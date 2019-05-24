'use strict';

const Island = require('../models/island');
const User = require('../models/user');
const Picture = require('../models/picture');
const fs = require('fs');
const cloudinary = require('cloudinary');

const Joi = require('joi');
const env = require('dotenv')
const cloudinaryConfig = {
    "cloud_name": "dlombard94",
    "api_key": "518919414164223",
    "api_secret": "5gtTQaciUESPpQyQiMgdP3orVkk",
};
cloudinary.config(cloudinaryConfig);


const Pictures = {

    uploadPicture: {
        handler: async function (request,h) {
            const title = request.payload.title;
            const islandId = request.params.islandid;
            const island = await Island.findById(islandId);
            const pictures = await Picture.find();
            const islands = await Island.find().populate('addedBy')

            //using cloudinary to upload image to temp folder and then onto cloudinary
            const response = fs.writeFile('./upload/temp.img', request.payload.file, err => {
                if(err){
                    console.log("ERROR");
                }
                const result = cloudinary.uploader.upload('./upload/temp.img',result => {
                    console.log(result);
                    //creates new picture object
                    //img contains url of image to be used on web app
                    //contains id of island it belongs to
                    const newPicture = new Picture({
                        img: result.url,
                        title: title,
                        island: island._id,
                    });
                    newPicture.save();
                });
                return h.redirect('/home');
            })
            return h.redirect('/home');
        }
    },
    deletePicture: {
        handler: async function(request, h) {
            try {
                const pics = await Picture.find().populate('island');
                const islands = await Island.find().populate('addedBy');
                const picId = request.params.pictureid;
                const islandId = request.params.islandid;

                // get index of object with pictureid passed in through route
                var removeIndex = pics.map(function(item) { return item.id; }).indexOf(picId);

                //getting rid of the picture that is to be deleted from pictures array
                const requiredPicture = pics[removeIndex];
                const island = await Island.findById(islandId);


                //loops through pics for an island and deletes the one with a matching id
                if(island.pictures.length != 0){
                    for (var i = 0; i < island.pictures.length; i++){
                        if(island.pictures[i]._id.equals(picId)){
                            island.pictures.splice(i,1);
                        }
                    }
                }

                await requiredPicture.remove();
                return h.redirect('/list');
            } catch (err) {
                return h.view('list', { errors: [{ message: err.message }] });
            }
        }
    }
};

module.exports = Pictures;