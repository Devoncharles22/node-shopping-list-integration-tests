const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, closeServer, runServer} = require('../server');
const should = chai.should( );
chai.use(chaiHttp);

if(require.main === module) {
	before(function( ) {
		return runServer( );
	});
	after(function( ) {
		return closeServer( );
	});
	runServer( ).catch(err => console.error(err));
};

describe('recipes', function ( ) {
	it('should list recipes on GET', function( ) {
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
			res.body.length.should.be.at.least(1);
			re.body.forEach(function(item) {
				item.should.be.a('object');
				item.should.include.keys('id', 'name', 'ingredients');
			});
		});
	});
});
it('should add a recipe on POST', function( ) {
	const newRecipe = {
		name: 'chocolate cake', ingredients: ['flour', 'chocolate', 'eggs', 'butter'];
	return chai.request(app)
		.post('/recipe');
		.send(newRecipe);
		.then(function(res) {
			res.should.have.status(201);
			res.should.be.json;
			res.body.should.be.a('object');
			res.body.should.include.keys('id', 'name', 'ingredients');
			res.body.name.should.equal(newRecipe.name);
			res.body.ingredients.should.be.a('array');
			res.body.ingredients.should.include.members(newRecipe.ingredients);
		});
	};
});
it('should update recipes on PUT', function( ){
	const updateData = {
		name: 'chocolate cake',
		ingredients: ['flour', 'chocolate', 'eggs', 'butter']
	};
	return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			updateData.id = res.body[0].id;
			return chai.request(app)
				.put('/recipes/${updateData.id')
				.send(updateData)
		});
		.then(function(res) {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.should.include.keys('id', 'name', 'ingredients');
			res.body.name.should.equal(updateData.name);
			res.body.id.should.equal(updateData.id);
			res.body.ingredients.should.include.members(updateData.ingredients);
		});
});
it('should delete recipes on DELETE', function( ) {
	return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			return chai.request(app)
				.delete('/recipes/${res.body[0].id')
		})
		.then(function(res) {
			res.should.have.status(204);
		});
});