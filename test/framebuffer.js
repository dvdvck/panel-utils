var expect = require('chai').expect,
Framebuffer = require('../lib/framebuffer'),
fb
;

describe('Framebuffer', function(){
	it('an instance of 64 width x 32 height bits', function(){
		fb = new Framebuffer(64, 32);
		expect(fb.buffer).is.length(64 * 32);
	});

	it('#nextCol', function(){
		fb = new Framebuffer(64, 32);
		var expected = 1;
		var col = fb.nextCol();
		expect(col).to.be.equal(expected);
	});

	it('#setXY', function(){
		fb =new Framebuffer(64, 32);
		fb.setXY(32, 16);
		expect(fb.x).to.be.equal(32);
		expect(fb.y).to.be.equal(16);
	});

	it('#updatePointer', function(){
		//width = cols; height = rows
		fb = new Framebuffer(64, 32);
		fb.setXY(32, 16);
		expect(fb.pointer).to.be.equal(16*64+32);

	});

	it('#nextLine', function(){
		fb = new Framebuffer(64, 32);
		var row = fb.nextLine();
		
		expect(row).to.be.equal(1);

		fb.setXY(63, 2);
		row = fb.nextLine();
		expect(row).to.be.equal(3);
	});

	it.skip('does a pullBit', function (){
		fb = new Framebuffer(4, 4);

		fb.buffer
		var value = fb.pullBit();

		expect(value).to.be.equal(0);
	});

	it.skip('does a pushBit', function (){
		fb = new Framebuffer(4, 4);
		fb.pushBit(1, 1, 1);
		var value = fb.pullBit(1, 1);

		expect(value).is.equal(1);
	});
	describe("with a few examples of #pushBitmap's", function(){

		it("8x8 at right-upper corner over 8x16 fb", function(){
			//constraint at 16 cols per row
			fb = new Framebuffer(8, 16);
			//zero
			var bitmap = [0x3C, 0x7E, 0x66, 0x66, 0x66, 0x66, 0x7E, 0x3C];
			var expected = [
			0,0,1,1, 1,1,0,0,
			0,1,1,1, 1,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,1, 1,1,1,0,
			0,0,1,1, 1,1,0,0,
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
			fb.pushBitmap(bitmap);
			// console.log(fb.buffer);
			expect(fb.buffer).to.be.deep.equal(expected);

		});

		it("8x8 at right-bottom corner over 16x16 fb", function(){
			fb = new Framebuffer(16, 16);
			fb.setXY(8, 8);
			//zero
			var bitmap = [0x3C, 0x7E, 0x66, 0x66, 0x66, 0x66, 0x7E, 0x3C];
			var expected = [
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0,  0,0,1,1, 1,1,0,0,
			0,0,0,0, 0,0,0,0,  0,1,1,1, 1,1,1,0,
			0,0,0,0, 0,0,0,0,  0,1,1,0, 0,1,1,0,
			0,0,0,0, 0,0,0,0,  0,1,1,0, 0,1,1,0,
			0,0,0,0, 0,0,0,0,  0,1,1,0, 0,1,1,0,
			0,0,0,0, 0,0,0,0,  0,1,1,0, 0,1,1,0,
			0,0,0,0, 0,0,0,0,  0,1,1,1, 1,1,1,0,
			0,0,0,0, 0,0,0,0,  0,0,1,1, 1,1,0,0
			];
			fb.pushBitmap(bitmap);

			expect(fb.buffer).to.be.deep.equal(expected);

		});
	});

});
