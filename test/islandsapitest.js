
'use strict';

const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Island API tests', function () {

    let islands = fixtures.islands;
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

    setup(async function () {
        await poiService.deleteAllIslands();
    });

    teardown(async function () {
        await poiService.deleteAllIslands();
    });

    test('create an island', async function () {
        const returnedIsland = await poiService.createIsland(newIsland);
        assert(_.some([returnedIsland], newIsland),  'returnedIsland must be a superset of newIsland');
        assert.isDefined(returnedIsland._id);
    });

    test('delete an island', async function () {
        let i = await poiService.createIsland(newIsland);
        assert(i._id != null);
        await poiService.deleteOneIsland(i._id);
        i = await poiService.getIsland(i._id);
        assert(i == null);
    });

    test('get an Island', async function () {
        const i1 = await poiService.createIsland(newIsland);
        const i2 = await poiService.getIsland(i1._id);
        assert.deepEqual(i1, i2);
    });

    test('get invalid island', async function () {
        const i1 = await poiService.getIsland('1234');
        assert.isNull(i1);
        const i2 = await poiService.getIsland('012345678901234567890123');
        assert.isNull(i2);
    });

    test('get all islands', async function () {
        for (let i of islands) {
            await poiService.createIsland(i);
        }
        const allIslands = await poiService.getIslands();
        console.log(allIslands);
        assert.equal(allIslands.length, islands.length);
    });

    test('get islands detail', async function () {
        for (let i of islands) {
            await poiService.createIsland(i);
        }

        const allIslands = await poiService.getIslands();
        for (var i = 0; i < islands.length; i++) {
            assert(_.some([allIslands[i]], islands[i]), 'returnedCandidate must be a superset of newCandidate');
        }
    });

    test('get all islands empty', async function () {
        const allIslands = await poiService.getIslands();
        assert.equal(allIslands.length, 0);
    });

});