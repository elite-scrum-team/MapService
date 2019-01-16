const proxyquire = require('proxyquire');
const chai = require('chai');
chai.use(require('sinon-chai'));
let expect = chai.expect;
const sinon = require('sinon');

const { makeMockModels } = require('sequelize-test-helpers');

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
});
let result;

const fakeCoordinate = { dataValues: sinon.stub(), reload: sinon.stub() };

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

        fakeCoordinate.dataValues.resetHistory();
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
            expect(fakeCoordinate.dataValues).not.to.have.been.called;
        });

        it('returned empty object', () => {
            expect(result).to.be.undefined;
        });
    });

    context('testing retrieveOne() on location that exists ', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(fakeCoordinate);
            result = await save.retrieveOne(location.id);
        });

        after(resetStubs);

        it('called User.findByPk', () => {
            expect(mockModels.location.findByPk).to.have.been.called;
        });

        it('returned the coordinate', () => {
            expect(result).to.deep.equal(fakeCoordinate);
        });
    });

    context('testing retrieve() on locations that does not exists', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(fakeCoordinate);
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
    // denne må gjøres på en ordenklig måte
    context('testing retrieve() on locations that exsists', () => {
        before(async () => {
            mockModels.location.findByPk.resolves(fakeCoordinate);
            result = await save.retrieve(location);
        });

        after(resetStubs);

        it('called User.findAll in controller', () => {});

        it('returned the filtered coordinates that doesnt exists', () => {});
    });

    context('testing create()', () => {
        before(async () => {
            mockModels.location.create.resolves(fakeCoordinate);
            result = await save.create(location);
        });

        after(resetStubs);

        it('called Location.create', () => {
            expect(mockModels.location.create).to.have.been.called;
        });

        it('called Municipality.findOne', () => {
            expect(mockModels.municipality.findOne).to.have.been.called;
        });
    });
});
