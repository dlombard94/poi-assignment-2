'use strict';
const Island = require('../models/island');
const User = require('../models/user');
const Review = require('../models/review');

const Joi = require('joi');


const Reviews = {
    // home: {
    //     handler: function(request, h) {
    //         return h.view('home', { title: 'Your Island Experience' });
    //     }
    // },
    listReview: {
        handler: async function(request, h) {
            //defining all islands and pictures
            const reviews = await Review.find().populate('island').populate('reviewer');
            const islands = await Island.find().populate('addedBy');

            return h.view('listreviewall', {
                title: 'List of Island Reviews',
                reviews: reviews,
                islands: islands
            });
        }
    },
    addReview: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                console.log(data);

                const rawIsland = request.payload.island;
                console.log(rawIsland);
                const island = await Island.findOne({name: rawIsland});

                console.log(island);
                const newReview = new Review({
                    review: data.review,
                    bestFor: data.bestFor,
                    reviewer: user._id,
                    island: island._id
                });
                console.log(newReview);
                await newReview.save();
                return h.redirect('/listreview');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },
    deleteReview: {
        handler: async function(request, h) {
            try {

                //getting rid of trailing "" on id
                const reviewId = request.params.reviewid;
                console.log(reviewId);
                var correctreviewId = reviewId.slice(0, -1);
                console.log(correctreviewId);

                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const reviews = await Review.find().populate('island');
                console.log(reviews);

                // get index of object with reviewid passed in through route
                var removeIndex = reviews.map(function(item) { return item.id; }).indexOf(correctreviewId);
                console.log(removeIndex);

                //getting rid of the review at the index that is to be deleted from array
                const requiredReview = reviews[removeIndex];
                console.log(requiredReview);

                await requiredReview.remove();

                return h.redirect('/listreview');
                //return h.view('list', { title: 'Islands List', islands: islands });
            } catch (err) {
                return h.view('listreviewall', { errors: [{ message: err.message }] });
            }
        }
    }
};

module.exports = Reviews;