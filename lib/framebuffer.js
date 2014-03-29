"use strict";
/* manipulacion de bajo nivel sobre el objeto virtual framebuffer 
El punto de referencia debe estar en relacion de como estan creados los bitmaps de lo caracteres con el objetivo de tener una transformacion de coordenadas transparente. Para la herramienta mikroe, la referencia es superior izquierdo, orden BE.
El punto de referencia esta posicionado en la esquina superior izquierda, considerando a cable de input en el lado derecho.

El punto de referencia esta posicionado en el centro(como manejas si son daisy chained? no escala bien :/)
La abscisa es con sentido a la derecha --> (- ... +) <- derecha
La ordenada es con sentido al cenit --> (- ... +) <- cenit
*/

/**
Que miembros tengo aqui?
	-rowSize
	-representacion interna del framebuffer
	-apuntador x,y
	-setPin(value) -- por ahora se limita a un color de 1bit
	-setX(x) // trivial
	-setY(y) // trivial ?
	-moveX(deltax)
	-moveY(deltay)
	-putCharacter(char) -- lee el tamaño del caracter y lo escribe en el framebuffer avanzando los apuntadores

	//animaciones
	--Fijacion del contexto de animacion. tanto se puede animar como todo el framebuffer como solo una parte de este. antes de ejecutar las funciones de animacion es requerido indicar el canvas sobre el cual se va a actuar.
	-setupCanvas(x,y, sizex, sizey) --retorna un layout con la  las animaciones
	-clone() -- copia la representacion interna
	-shiftUp(nextDown) - desplaza un lugar hacia arriba. Opcionalmente recibe la linea que se introduce abajo
	-shiftDown(nextUp)
	-shiftRight(nextLeft)
	-shiftLeft(nextRight)


*/

function initArray(len, acc) {
    if (acc == null) acc = [];
    if (len <= 1) return acc;
    var b = initArray(len >> 1, [0]);
    b = b.concat(b);
    if (len & 1) b = b.concat([0]);
    return b;
}

function initArray2(size, value) {
	value = [value || 0];

	return (function innerInit(len, acc){
		console.log(acc);
		len >>= 1;
	    if (len > 1) {
	    	acc = innerInit(len, value);
	    	acc = acc.concat(acc);
	    }
	    if (len & 1){
	    	acc = acc.concat(value);
	    }
	    return acc;
	})(size, value);
}

/** Crea un fb interno de width*height bits
	@param with 
	@param height
*/
var Framebuffer = function(width, height){
	this.x = 0;
	this.y = 0;
	this.pointer = 0;
	//pointer es dependiente de x,y
	// this.updatePointer();

	this.rows = height;
	this.cols = width;
	this.buffer = initArray(width * height);
};

/*Encapsula el array y retorna una instancia de Framebuffer 
Originalmente se pensaba en un constructor sobrecargado pero parece que no 
existen en js*/
Framebuffer.create = function(array, width){
	var height = array.length / width;
	var fb = new Framebuffer(width, height);
	fb.buffer = array;
	return fb;
};

/* crea un framebuffer a partir de la representacion de un buffer */
Framebuffer.transfer = function(buffer, width){
	if(width == undefined){
		throw new Error("required width parameter: how many colums have this?");
	}
	var height = buffer.length * 8 / width;
	var newbuffer = [];
	for(var i = 0; i < buffer.length; i++){
		var byte = buffer[i];
		for(var j = 0; j < 8; j++){
			var bit = (byte >> j) & 1;
			newbuffer.push(bit);
		}
	}
	var fb = new Framebuffer(width, height);
	fb.buffer = newbuffer;
	return fb;
};

Framebuffer.prototype = {
	/*Recibe un array de bitmap y lo coloca en el fb
	usando su ancho definido*/
	pushBitmap: function(bitmap){
		// var rows = bitmap.rows;
		var height = 8;  //vertical bits
		var width = 8;	//horizontal
		bitmap.forEach(function (chunk){
			for(var pos = 0; pos < width; pos++){
				this.buffer[this.pointer] = (chunk >> pos) & 1;	
				this.nextPoint(width);
			}
			
		}, this);

		//actualizar x,y para el siguiente bitmap
		if(this.x + width >= this.cols){
			this.setXY(0, this.y + height);
		}else{
			this.setXY(this.x + width);	
		}
	},
	/*Toma la referencia relativa desde que se empezo a trazar
	el bitmap en el framebuffer, avanzando al siguiente punto de
	para trazar*/
	nextPoint: function(width){
		this.pointer++;
		if((this.pointer - this.x) % width == 0){
			this.pointer += this.cols - width;
		}
	},

	nextCol: function(){
		this.pointer++;
		return this.pointer % this.cols;
	},

	/*depende de el ancho del framebuffer. mueve pointer a la 
	posicion siguiente, debajo del la columna anterior. Analogo
	a \r\n*/
	nextLine: function(){
		var startLine;
		if(this.pointer == 0){
			startLine = 0;
		}else{
			startLine = this.pointer % this.cols;
		}

		this.pointer += this.cols - startLine;
		return parseInt(this.pointer / this.cols);
	},
	/*coloca el puntero en la posicion x,y 
	el tamaño de linea esta en relacion con el largo del fb*/
	updatePointer: function(){
		this.pointer = this.y * this.cols + this.x;
	},

	/* Recibe null si no se quiere colocar x, igual para y */
	setXY: function(newX, newY){
		if(newX !== undefined){
			this.x = newX;
		}
		if(newY !== undefined){
			this.y = newY;
		}
		this.updatePointer();
	},
	/* compacta el buffer en bloques de 8 bits. cada bloque invierte el ordenamiento y lo parsea a un numero decimal */
	compact: function(){
		//empaquetar en octetos
		var buffer = [], octet, size = 8;
		for(var i = 0; i< this.buffer.length; i = i + size){
			octet = this.buffer.slice(i, i + size);
			buffer.push(parseInt(octet.reverse().join(''), 2));
		}

		return buffer; 
	},

	transfer: function(){
		return new Buffer(this.compact());
	},

	/* copia los valores del framebuffer en la posicion del pointer */
	copy: function(fb){
		fb.buffer.forEach(function (v){
			this.buffer[this.pointer++] = v;
		}, this);
	},

	draw: function(){
		var util = require('util');
		util.print("\nBuffer length:", this.buffer.length);

		for(var i = 0; i < this.buffer.length; i++){
			// (step byte) + (element scan)
			var index = (parseInt(i / 8) * 8) + (i % 8);

			if(index % this.cols == 0){
				console.log();
			}

			if(this.buffer[index] == 1){
				util.print('\u25C9'); //25C9 273A
			}else{
				util.print('\u00B7'); //00B7
			}
		}
		console.log();
	}
};

module.exports = Framebuffer;