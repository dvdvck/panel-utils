var font = require('../lib/std_8x8');

var expect = require('chai').expect;

describe('A 8x8 font bitmap', function(){
	
	it('is an object', function(){
		expect(font).is.an('object');
	});


	describe('on each element of this object', function(){
		var keys = ['48','49','50','51','52','53','54','55','56','57','109'];
		var fontkeys = Object.keys(font);
	
		it('contains at least numeric and "m" mappings', function(){

			expect(font).to.include.keys(keys);
		});

		describe('For each array', function(){

			it('has eight elements', function(){

				fontkeys.forEach(function(bitmap){
					expect(font[bitmap]).have.length(8);
				});
			});
		});
	});
})