'use strict';

const Boom = require('boom');
const Review = require('../models/review');
const Island = require('../models/island');
const utils = require('./utils.js');

const Reviews = {
    findAll: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function (request, h) {
            const reviews = await Review.find();
            return reviews;
        }
    },

    findByIsland: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            console.log(request.params.id);
            const reviews = await Review.find({ island: request.params.id });
            return reviews;
        }
    },
    addReview: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            const userId = utils.getUserIdFromRequest(request);
            let review = new Review(request.payload);
            const island = await Island.findOne({ _id: request.params.id });
            if (!review) {
                return Boom.notFound('No Island with this id');
            }
            review.island = island._id;
            review.reviewer = userId;
            review = await review.save();
            return review;
        }
    },
    deleteReviews: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            await Review.deleteMany({island: request.params.id });
            return { success: true };
        }
    },
    deleteAll: {
        auth: {
            strategy: 'jwt',
        },
        handler: async function(request, h) {
            await Review.deleteMany({});
            return { success: true };
        }
    }
};

module.exports = Reviews;