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
