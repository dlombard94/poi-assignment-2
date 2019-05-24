'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Review API tests', function() {
    let reviews = fixtures.reviews;
    let newIsland = fixtures.newIsland;

    const poiService = new PoiService('http://Dlombard:3000');

    setup(async function() {
        // poiService.deleteAllIslands();
        // poiService.deleteAllReviews();
    });

    teardown(async function() {
        // poiService.deleteAllIslands();
        // poiService.deleteAllReviews();
    });

    test('create a review', async function() {
        const returnedIsland = await poiService.createIsland(newIsland);
        console.log(returnedIsland);
        console.log(returnedIsland._id);
        console.log(reviews[0]);


        await poiService.addReview(returnedIsland._id, reviews[0]);
        const returnedReviews = await poiService.getReviews(returnedIsland._id);
        console.log(returnedReviews);
        assert.equal(returnedReviews.length, 1);
        assert(_.some([returnedReviews[0]], reviews[0]), 'returned review must be a superset of review');
    });

    test('create multiple reviews', async function() {
        const returnedIsland = await poiService.createIsland(newIsland);
        for (var i = 0; i < reviews.length; i++) {
            await poiService.addReview(returnedIsland._id, reviews[i]);
        }

        const returnedReviews = await poiService.getReviews(returnedIsland._id);
        assert.equal(returnedReviews.length, reviews.length);
        for (var i = 0; i < reviews.length; i++) {
            assert(_.some([returnedReviews[i]], reviews[i]), 'returned review must be a superset of review');
        }
    });

    test('delete reviews', async function () {
        const returnedIsland = await poiService.createIsland(newIsland);
        for (var i = 0; i < reviews.length; i++) {
            await poiService.addReview(returnedIsland._id, reviews[i]);
        }

        await poiService.deleteReviews(returnedIsland._id);
        const r = await poiService.getReviews(returnedIsland._id);
        console.log(r);
        assert.equal(r.length, 0);
    });

    test('delete all reviews', async function() {
        const returnedIsland = await poiService.createIsland(newIsland);
        for (var i = 0; i < reviews.length; i++) {
            await poiService.addReview(returnedIsland._id, reviews[i]);
        }

        const r1 = await poiService.getReviews(returnedIsland._id);
        assert.equal(r1.length, reviews.length);
        await poiService.deleteAllReviews();
        const r2 = await poiService.getReviews(returnedIsland._id);
        assert.equal(r2.length, 0);
    });
});