//NOTES:
// try to be small;
// try not using "this"/"new";
// @ref
// https://github.com/muhmi/javascript-bson/blob/master/lib/bson.js

//before complete, maybe tmp use:
//https://cdnjs.cloudflare.com/ajax/libs/js-bson/2.0.8/bson.min.js
/*usage{
const BSON = require('./bson.min');

const bson = new BSON();//TODO ...

//console.log(bson.serialize,BSON.Long);

const Long = BSON.Long;

const doc = { long: Long.fromNumber(100) };

// Serialize a document
const data = bson.serialize(doc);
console.log('data:', data);

// Deserialize the resulting Buffer
const doc_2 = bson.deserialize(data);
console.log('doc_2:', doc_2);
|*/

//;(function(hook_parent) { })();
//	hook_parent = hook_parent
//		typeof exports != 'undefined' ? exports :
//		typeof self != 'undefined' ? self : // #8: web workers
//		$.global; // #31: ExtendScript

//TODO build a Buffer for browser later...
function factory_binary_encoder(hook_parent){
	var buffer = [];
	var offset = 0;
	var length = 0;
	var _this = {
		offset,buffer
		,pack : function() {
			var data = Buffer.alloc(buffer.length + 5), o = 0;

			for (var i = 0; i < data.length; i++) data[i] = 0;

			data[o++] = ((5+buffer.length) >> 0) & 0xff;
			data[o++] = ((5+buffer.length) >> 8) & 0xff;
			data[o++] = ((5+buffer.length) >> 16) & 0xff;
			data[o++] = ((5+buffer.length) >> 24) & 0xff;

			for (var i = 0; i < buffer.length; i++) { data[o++] = buffer[i] }

			data[o++] = 0;

			return data;
		}
		,writeByte : function (v) {
			buffer.push( v & 0xff);
		}
		,writeCstring : function (v) {
			for (var i = 0; i < v.length; i++) {
				_this.writeByte(v.charCodeAt(i));
			}
			_this.writeByte(0);
		}
		,writeBytes : function (buf) {
			for (var i = 0; i < buf.length; i++) {
				_this.writeByte(buf[i]);
			}
		}
		,write32 : function (v) {
			buffer.push((v)    );
			buffer.push((v>>8) );
			buffer.push((v>>16));
			buffer.push((v>>24));
		}
		,writeString : function (v) {
			var buf = Buffer.from(v, 'utf8');
			_this.write32(buf.length+1);
			for (var i = 0; i < buf.length; i++) {
				_this.writeByte(buf[i]);
			}
			_this.writeByte(0);
		}
		,encodeItem : function (k, v) {
			// console.log("k="+k+ ",v="+v+" t="+typeof(v));
			if (v == null || typeof(v) == 'undefined') {
				_this.writeByte(0x0a);
				_this.writeCstring(k);
				return;
			}
			if (typeof(v) == 'string') {
				_this.writeByte(0x02);
				_this.writeCstring(k);
				_this.writeString(v);
				return;
			}
			if (typeof(v) == 'number') {
				if (Math.round(v) == v) {
					_this.writeByte(0x10);
					_this.writeCstring(k);
					_this.write32(v);
				} else {
					//TODO
					_this.writeByte(0x11);
					_this.writeCstring(k);
					_this.writeInt64(v);
				}
				return;
			}
			if (v instanceof Array) {
				_this.writeByte(0x04);
				_this.writeCstring(k);
				_this.writeBytes(factory_binary_encoder().encode(v));
				return;
			}
			if (v instanceof Buffer) {
				_this.writeByte(0x05);
				_this.writeCstring(k);
				_this.writeBinary(v)
				return;
			}
			if (typeof(v) == 'object') {
				_this.writeByte(0x03);
				_this.writeCstring(k);
				_this.writeBytes(factory_binary_encoder().encode(v));//这里是递归...
				return;
			}
		}
		,encode : function (object) {
			//TODO 递归...见上面
			for (var k in object) {
				_this.encodeItem(k, object[k]);
			}
			return _this.pack();
		}
	};
	return _this;
}

function factory_binary_decoder(hook_parent){
	var data = [];
	var offset = 0;
	var length = 0;
	var _this = {
		offset,data
		,readByte:function(){
			return data[offset++];
		}
		,reset : function (_data) {
			offset = 0;
			length = 0;
			data = _data || [];
		}
		,read32 : function(){
			var v = 0;
			v |= (data[offset+3] << 24);
			v |= (data[offset+2] << 16);
			v |= (data[offset+1] << 8);
			v |= (data[offset+0]);
			offset += 4;
			return v;
		}
		//,read64//TODO
		,decode: function (_data) {
			if(typeof(_data)=='Buffer') throw "need decode(Buffer data)";
			_this.reset(_data);
			_this.length = _this.read32();
			_this.length -= offset;
			return _this._inner_decode();
		}
		,_inner_decode: function () {
			var kv = {};
			while (offset < _this.length - 1) {

				var type = _this.readByte();

				// TODO: there is a bug in the decoder or encoder... see the line below
				if (type == 0x00) return kv;

				if (type == 0x1) {
					var k = _this.parseCstring(),
						v = _this.parseFloat();
					kv[k]=v;
					continue;
				}

				if (type == 0x2) {
					var k = _this.parseCstring(),
						v = _this.parseString();
					kv[k]=v;
					continue;
				}

				if (type == 0x3 || type == 0x4) {
					var k = _this.parseCstring(),
						v = factory_binary_decoder().decode(data.slice(offset));
					offset += _this.read32();
					if (type == 4) {
						c = [];
						for (i in v) c.push(v[i]);
						v = c;
					}

					kv[k]=v;
					continue;
				}

				if (type == 0x5) {
					var k = _this.parseCstring(),
						v = _this.parseBinary();
					kv[k]=v;
					continue;
				}

				if (type == 0x8) {
					var k = _this.parseCstring(),
						v = _this.readByte() == 1;
					kv[k]=v;
					continue;
				}

				if (type == 0x9) {
					var k = _this.parseCstring(),
						v = _this.readInt64();
					kv[k]=new Date(v);
					continue;
				}

				if (type == 0x0a) {
					var k = _this.parseCstring();
					kv[k]=null;
					continue;
				}

				if (type == 0x10) {
					var k = _this.parseCstring(),
						v = _this.read32();
					kv[k]=v;
					continue;
				}

				if (type == 0x11) {
					var k = _this.parseCstring(),
						v = _this.readInt64();
					kv[k]=v;
					continue;
				}

				throw "Unrecognized data type 0x" + type.toString(16) + " @"+offset;

			};

			return kv;
		}//_inner_decode

		,parseCstring : function () {
			var str = Buffer.alloc(256), i;
			for (i = 0; i < 256; i++) {
				var chr = _this.readByte();
				if (chr == 0) break;
				str[i] = chr;
			}
			return str.toString('ascii', 0, i);
		}
		,parseFloat : function () {
			return _this.readInt64();
		}
		,parseString : function () {
			var len = _this.read32();
			var str = Buffer.alloc(len), i;

			for (i = 0; i < len; i++) {
				str[i] = data[offset++];
			}
			return str.toString('utf8', 0, len-1);
		}

		,parseBinary : function () {
			var len = _this.read32();
			var type = _this.readByte(); // TODO: sub type is ignored for now
			var str = Buffer.alloc(len), i;
			for (i = 0; i < len; i++) {
				str[i] = data[offset++];
			}
			return str;
		}
	};
	return _this;
}
//function factory_binary(hook_parent){
//}

var logger=console;

var	NOP=1,
	PUSH=2
	;
var mytest=[
	[NOP],
	[PUSH],
];
var object = {mytest,
	//key: 'value', list: [1,2,3,4,5,6,7,8,9], magical: 10, sub: {list: ['string', 'list', 10]}
};

var encoded = factory_binary_encoder().encode(object);
logger.log('encoded=',encoded,encoded.length,' with ', JSON.stringify(object).length);

var decoded = factory_binary_decoder().decode(encoded);
logger.log('decoded=',decoded);

const BSON = require('./bson.min');
const bson = new BSON();
var decoded = bson.deserialize(encoded);
console.log('decoded:', decoded);

var encoded2 = bson.serialize(object);
console.log('encoded2:', encoded2,encoded2.length);
var decoded2 = bson.deserialize(encoded2);
console.log('decoded2:', decoded2);


