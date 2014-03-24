/* manipulacion de bajo nivel sobre el objeto virtual framebuffer 
El punto de referencia debe estar en relacion de como estan creados los bitmaps de lo caracteres con el objetivo de tener una transformacion de coordenadas transparente. Para la herramienta mikroe, la referencia es superior izquierdo BE.
El punto de referencia esta posicionado en la esquina superior izquierda.

El punto de referencia esta posicionado en el centro(como manejas si son daisy chained? no escala bien :/)
La abscisa es con sentido a la derecha --> (- ... +) <- derecha
La ordenada es con sentido al cenit --> (- ... +) <- cenit
*/

/**
Que miembros tengo aqui?
	-representacion interna del framebuffer
	-apuntador x,y
	-setPin(value) -- por ahora se limita a un color de 1bit
	-setX(x)
	-setY(y)
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