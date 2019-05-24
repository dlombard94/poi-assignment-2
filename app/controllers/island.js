'use strict';
const Island = require('../models/island');
const User = require('../models/user');
const Picture = require('../models/picture');

const Joi = require('joi');


const Islands = {
    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Your Island Experience' });
        }
    },
    list: {
        handler: async function(request, h) {
            //defining all islands and pictures
            const islands = await Island.find().populate('addedBy');
            const pics = await Picture.find().populate('island');

            //nested for loop to assign correct pics to correct islands
            for (var i=0; i < islands.length; i++) {
                //have to wipe the pics to avoid doubling up after deleting another pic
                islands[i].pictures.length = 0;
                for (var j=0; j < pics.length; j++) {
                    //if referenced island id for pic matches current island id - add pic to current island
                    if(islands[i]._id.equals(pics[j].island._id)){
                        islands[i].pictures.push(pics[j]);
                        await islands[i].save();
                    }
                }
            }

            return h.view('list', {
                title: 'List of Islands',
                islands: islands,
            });
        }
    },
    addIsland: {
        handler: async function(request, h) {
            try{
                //adding island via addIsland form
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const newIsland = new Island({
                    name: data.name,
                    area: data.area,
                    description: data.description,
                    location:{
                        latitude: data.latitude,
                        longitude: data.longitude
                    },
                    category: data.category,
                    addedBy: user._id
                });
                await newIsland.save();
                return h.redirect('/list');
            }catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },
    categorizeIslands: {
        handler: async function(request, h) {
            try{
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                //date = category selection via form
                const data = request.payload;
                const islands = await Island.find().populate('addedBy');

                //define empty array to store categorized islands
                const categorizedIslands = [];


                //checks what the cateogry selection is
                //loops through all islands and if category matche it adds island to categorizedIsland array
                //returns list view with the categorized islands passed
                if (data.choice === "south"){

                    const southIslands = [];
                    var i;
                    for (i = 0; i < islands.length; i++) {
                        if(islands[i].category === "South") {
                            southIslands.push(islands[i]);
                        }
                    };
                    console.log(southIslands)
                    return h.view('list', {categorizedIslands : southIslands});

                } else if (data.choice === "north"){

                    const southIslands = [];
                    var i;
                    for (i = 0; i < islands.length; i++) {
                        if(islands[i].category === "South") {
                            southIslands.push(islands[i]);
                        }
                    };
                    console.log(southIslands)
                    return h.view('list', {categorizedIslands : southIslands});

                } else if (data.choice === "west"){

                    const southIslands = [];
                    var i;
                    for (i = 0; i < islands.length; i++) {
                        if(islands[i].category === "South") {
                            southIslands.push(islands[i]);
                        }
                    };
                    console.log(southIslands)
                    return h.view('list', {categorizedIslands : southIslands});

                } else {

                    const southIslands = [];
                    var i;
                    for (i = 0; i < islands.length; i++) {
                        if(islands[i].category === "South") {
                            southIslands.push(islands[i]);
                        }
                    };
                    console.log(southIslands)
                    return h.view('list', {categorizedIslands : southIslands});

                }

            }catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },
    deleteIsland: {
        handler: async function(request, h) {
            try {
                console.log(request.params.islandid);

                //getting rid of trailing "" on id
                const islandId = request.params.islandid ;
                var correctIslandId = islandId.slice(0, -1);

                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const islands = await Island.find().populate('addedBy');

                // get index of object with islandid passed in through route
                var removeIndex = islands.map(function(item) { return item.id; }).indexOf(correctIslandId);

                //getting rid of the island at the index that is to be deleted from array
                const requiredIsland = islands[removeIndex];
                await requiredIsland.remove();

                return h.redirect('/list');
                //return h.view('list', { title: 'Islands List', islands: islands });
            } catch (err) {
                return h.view('list', { errors: [{ message: err.message }] });
            }
        }
    },
    showIsland: {
        handler: async function(request, h) {
            try {
                console.log(request.params.islandid);

                //getting rid of trailing "" on id
                const islandId = request.params.islandid ;
                var correctIslandId = islandId.slice(0, -1);

                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const islands = await Island.find().populate('addedBy');

                // get index of object with islandid passed in through route
                // then getting island at this index
                var requiredIndex = islands.map(function(item) { return item.id; }).indexOf(correctIslandId);
                const requiredIsland = islands[requiredIndex];

                return h.view('islandsettings', { title: 'Update Island', island: requiredIsland });
            } catch (err) {
                return h.view('list', { errors: [{ message: err.message }] });
            }
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

                //getting rid of the picture that is to be deleted from pictures array at that index
                const requiredPicture = pics[removeIndex];

                const island = await Island.findById(islandId);


                //loops through the specific pics for each island and removes pic if id matches
                if(island.pictures.length != 0){
                    for (var i = 0; i < island.pictures.length; i++){
                        if(island.pictures[i]._id.equals(picId)){
                            island.pictures.splice(i,1);
                        }
                    }
                }

                await island.save();
                await requiredPicture.remove();
                await island.save();
                return h.redirect('/list');
            } catch (err) {
                return h.view('list', { errors: [{ message: err.message }] });
            }
        }
    },
    updateIsland: {
        //validation nnot working for some reason*******************************
        // validate: {
        //     payload: {
        //         name: Joi.string().required(),
        //         area: Joi.number().required(),
        //         location:{
        //             latitude: Joi.number().required(),
        //             longitude: Joi.number().required(),
        //
        //         },
        //         description: Joi.string().required(),
        //         category: Joi.string().required(),
        //         addedBy: Joi.string().required(),
        //     },
        //     options: {
        //         abortEarly: false
        //     },
        //     failAction: function(request, h, error) {
        //         return h
        //             .view('islandsettings', {
        //                 title: 'Update error',
        //                 errors: error.details
        //             })
        //             .takeover()
        //             .code(400);
        //     }
        // },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;

                //dont have to get rid of " because that's done in the showisland method
                const islandId = request.params.islandid ;


                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const islands = await Island.find().populate('addedBy');

                //finding index with islandid passed in through route
                //then finds island at this index
                var requiredIndex = islands.map(function(item) { return item.id; }).indexOf(islandId);
                const requiredIsland = islands[requiredIndex];

                //updates all selected islands parameters with values passed in through form
                requiredIsland.name = userEdit.name;
                requiredIsland.area = userEdit.area;
                requiredIsland.description = userEdit.description;
                requiredIsland.category = userEdit.category;
                requiredIsland.location.latitude = userEdit.latitude;
                requiredIsland.location.longitude = userEdit.longitude;
                await requiredIsland.save();

                return h.view('list', { title: 'Islands List', islands: islands });
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    }
};

module.exports = Islands;