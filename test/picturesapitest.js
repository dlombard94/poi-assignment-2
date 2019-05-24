'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Picture API tests', function() {
    let pictures = fixtures.pictures;
    let newIsland = fixtures.newIsland;
    let newUser = fixtures.newUser;

    const poiService = new PoiService('http://Dlombard:3000');

    suiteSetup(async function() {
        await poiService.deleteAllUsers();
        const returnedUser = await poiService.createUser(newUser);
        const response = await poiService.authenticate(newUser);
    });

    suiteTeardown(async function() {
        await poiService.deleteAllUsers();
        poiService.clearAuth();
    });

    setup(async function() {
        poiService.deleteAllPictures();
    });

    teardown(async function() {
        poiService.deleteAllPictures();
    });

    test('create a picture', async function() {
        const returnedIsland = await poiService.createIsland(newIsland);
        console.log(returnedIsland);
        console.log(returnedIsland._id);
        console.log(pictures[0]);


        await poiService.addPicture(returnedIsland._id, pictures[0]);
        const returnedPictures = await poiService.getPictures(returnedIsland._id);
        console.log(returnedPictures);
        assert.equal(returnedPictures.length, 1);
        assert(_.some([returnedPictures[0]], pictures[0]), 'returned picture must be a superset of picture');
    });

    test('create multiple pictures', async function() {
        const returnedIsland = await poiService.createIsland(newIsland);
        for (var i = 0; i < pictures.length; i++) {
            await poiService.addPicture(returnedIsland._id, pictures[i]);
        }

        const returnedPictures = await poiService.getPictures(returnedIsland._id);
        assert.equal(returnedPictures.length, pictures.length);
        for (var i = 0; i < pictures.length; i++) {
            assert(_.some([returnedPictures[i]], pictures[i]), 'returned picture must be a superset of picture');
        }
    });

    test('delete pictures', async function () {
        const returnedIsland = await poiService.createIsland(newIsland);
        for (var i = 0; i < pictures.length; i++) {
            await poiService.addPicture(returnedIsland._id, pictures[i]);
        }

        poiService.deletePictures(returnedIsland._id);
        const p = await poiService.getPictures(returnedIsland._id);
        console.log(p);
        assert.equal(p.length, 0);
    });

    test('delete all pictures', async function() {
        const returnedIsland = await poiService.createIsland(newIsland);
        for (var i = 0; i < pictures.length; i++) {
            await poiService.addPicture(returnedIsland._id, pictures[i]);
        }

        const p1 = await poiService.getPictures(returnedIsland._id);
        assert.equal(p1.length, pictures.length);
        await poiService.deleteAllPictures();
        const p2 = await poiService.getPictures(returnedIsland._id);
        assert.equal(p2.length, 0);
    });
});