function factory_buffer(){
	return [];
}
var obj = factory_buffer();
console.log(obj);

function MyBuffer (arg, encodingOrOffset, length) {
  //throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	return this;
}

var obj = new MyBuffer();

console.log(obj,typeof obj, (obj instanceof MyBuffer)?'is_MyBuffer_true':'is_MyBuffer_false');

console.log(obj[0]);
