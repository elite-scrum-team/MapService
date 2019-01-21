const proxyquire = require('proxyquire');
const chai = require('chai');
chai.use(require('sinon-chai'));
let expect = chai.expect;
const sinon = require('sinon');

const { makeMockModels } = require('sequelize-test-helpers');
const mockGoogleAPI = require('./__mock__/GeoCodingAPI');

const mockModels = makeMockModels({
    location: {
        create: sinon.stub(),
        findAll: sinon.stub(),
        findByPk: sinon.stub(),
        reload: sinon.stub(),
    },
    municipality: { create: sinon.stub(), findOne: sinon.stub() },
});

const save = proxyquire('../controllers/LocationController', {
    '../models': mockModels,
    '../services/GeoCodingAPI': mockGoogleAPI,
});

let result;

const fakeLocation = { dataValues: sinon.stub(), reload: sinon.stub() };

describe('Location testing', () => {
    const location = {
        id: 1,
        lat: '123',
        lng: '3123',
    };

    const resetStubs = () => {
        mockModels.location.findByPk.resetHistory();
        mockModels.location.create.resetHistory();
        mockModels.location.findAll.resetHistory();

        mockModels.municipality.findOne.resetHistory();
        mockModels.municipality.create.resetHistory();

        fakeLocation.dataValues.resetHistory();
    };

    context('testing retrieveOne() on location that doesnt exist ', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(undefined);
            result = await save.retrieveOne(location.id);
        });

        after(resetStubs);

        it('called User.findOne', () => {
            expect(mockModels.location.findByPk).to.have.been.called;
        });

        it("didn't call location.update", () => {
            expect(fakeLocation.dataValues).not.to.have.been.called;
        });

        it('returned empty object', () => {
            expect(result).to.be.undefined;
        });
    });

    context('testing retrieveOne() on location that exists ', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(fakeLocation);
            result = await save.retrieveOne(location.id);
        });

        after(resetStubs);

        it('called User.findByPk', () => {
            expect(mockModels.location.findByPk).to.have.been.called;
        });

        it('returned the coordinate', () => {
            expect(result).to.deep.equal(fakeLocation);
        });
    });

    context('testing retrieve() on locations that does not exists', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(fakeLocation);
            result = await save.retrieve(location);
        });

        after(resetStubs);

        it('called User.findAll in controller', () => {
            expect(mockModels.location.findAll).to.have.been.called;
        });

        it('returned the filtered coordinates that doesnt exists', () => {
            expect(result).to.deep.equal(undefined);
        });
    });

    context('testing create()', () => {
        before(async () => {
            mockModels.location.create.resolves(fakeLocation);
            result = await save.create(location);
        });

        after(resetStubs);

        it('called Location.create', () => {
            expect(mockModels.location.create).to.have.been.called;
        });
        /*
        it('called Municipality.findOne', () => {
            expect(mockModels.municipality.findOne).to.have.been.called;
        });

        it('called Municipality.create', () => {
            expect(mockModels.municipality.create).to.have.been.called;
        });
        */
    });

    context('testing retrieve() on locations that exsists', () => {
        before(async () => {
            mockModels.location.findAll.resolves(fakeLocation);
            result = await save.retrieve('blue');
        });

        after(resetStubs);

        it('checking if findAll is called ', () => {
            expect(mockModels.location.findAll).to.have.been.called;
        });

        it('returned the location', () => {
            expect(result).to.deep.equal(fakeLocation);
        });
    });

    context('testing retrieveOne() on locations that exsists', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(fakeLocation);
            result = await save.retrieveOne(location.id);
        });

        after(resetStubs);

        it('checking if findByPk is called ', () => {
            expect(mockModels.location.findByPk).to.have.been.called;
        });

        it('returned the location', () => {
            expect(result).to.deep.equal(fakeLocation);
        });
    });
});
