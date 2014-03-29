var expect = require('chai').expect,
Framebuffer = require('../lib/framebuffer'),
bitmap = require('../lib/std_8x8'),
fb
;
var zero = [0x3C, 0x7E, 0x66, 0x66, 0x66, 0x66, 0x7E, 0x3C];
var eme = [0x00, 0x00, 0x7E, 0xFF, 0xDB, 0xDB, 0xDB, 0xDB];

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

		fb.setXY();
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

	/* Empaqueta el framebuffer en un objeto buffer. Usado para el envio
	por la red */
	it('#transfer', function(){
		fb = new Framebuffer(64, 16);
		
		fb.pushBitmap(zero);
		var transfer = fb.transfer();
		fb.draw();
		expect(transfer).to.be.instanceof(Buffer);
		expect(transfer.length).to.be.equal(64/8*16);
	});

	it("#copy", function(){
		fb = new Framebuffer(16, 16);
		var fb1 = new Framebuffer(16, 16);

		var expected = [
			0,0,1,1, 1,1,0,0, 0,0,0,0, 0,0,0,0,
			0,1,1,1, 1,1,1,0, 0,0,0,0, 0,0,0,0,
			0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0,
			0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0,
			0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0,
			0,1,1,0, 0,1,1,0, 0,0,0,0, 0,0,0,0,
			0,1,1,1, 1,1,1,0, 0,0,0,0, 0,0,0,0,
			0,0,1,1, 1,1,0,0, 0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0
		];

		fb1.pushBitmap(zero);

		fb.copy(fb1);
		fb1.draw();

		expect(fb.buffer).to.be.deep.equal(expected);
	});

	describe("with a few examples of #pushBitmap's", function(){

		it("8x8 at right-bottom corner over 8x16 fb", function(){
			//constraint at 16 cols per row
			fb = new Framebuffer(8, 16);
			var expected = [
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
			0,0,1,1, 1,1,0,0,
			0,1,1,1, 1,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0,
			0,1,1,1, 1,1,1,0,
			0,0,1,1, 1,1,0,0
			];
			var expected = [
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0,
			0,1,1,1, 1,1,1,0,
			1,1,1,1, 1,1,1,1,
			1,1,0,1, 1,0,1,1,
			1,1,0,1, 1,0,1,1,
			1,1,0,1, 1,0,1,1,
			1,1,0,1, 1,0,1,1
			];
			fb.setXY(null, 8);
			fb.pushBitmap(bitmap[String('m').charCodeAt()]);
			fb.draw();
			expect(fb.buffer).to.be.deep.equal(expected);

		});

		it("#compact", function(){
			fb = new Framebuffer(8, 8);
			fb.pushBitmap(bitmap[String('m').charCodeAt()]);	
			var c = fb.compact();

			expect(c).to.be.deep.equal(eme);		
		});

		it("8x8 at right-bottom corner over 16x16 fb", function(){
			fb = new Framebuffer(16, 16);
			fb.setXY(8, 8);
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
			fb.pushBitmap(zero);
			fb.draw();

			expect(fb.buffer).to.be.deep.equal(expected);

		});

		it("two 8x8 bitmaps over 16x16 fb", function(){
			fb = new Framebuffer(16, 16);
			var expected = [
			0,0,1,1, 1,1,0,0, 0,0,1,1, 1,1,0,0,
			0,1,1,1, 1,1,1,0, 0,1,1,1, 1,1,1,0,
			0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0,
			0,1,1,0, 0,1,1,0, 0,1,1,0, 0,1,1,0,
			0,1,1,1, 1,1,1,0, 0,1,1,1, 1,1,1,0,
			0,0,1,1, 1,1,0,0, 0,0,1,1, 1,1,0,0,
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
			0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];

			fb.pushBitmap(zero);
			fb.pushBitmap(zero);
			fb.draw();
			expect(fb.buffer).to.be.deep.equal(expected);

		});
	});

});
