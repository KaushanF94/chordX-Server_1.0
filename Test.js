//Author-Kaushan Fernando-2014288
var expect = require('chai').expect;
var should = require('chai').should();
var connection = require('./connection');

describe('chordx', function(){
	it('Database Connection Test', function(done){
		connection.getConnection(function(err,connection){
	       connection.should.be.an('object');
	       done();
    	});
	})
})
