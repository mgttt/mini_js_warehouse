
//in case that u want using JSON
function o2s(o){try{return JSON.stringify(o);}catch(ex){}}

//home made
function o2s(o,f,t){//20170601
	if(null==o)return "null";
	f=arguments.callee;
	t=typeof o;
	var r=[];
	if('object'==t){if(Array==o.constructor)t='array';else if(RegExp==o.constructor)t='regexp'};
	switch(t){
		case 'function':return !('prototype' in o)?"function(){}":(""+o)
		case 'boolean':case 'regexp':return o.toString()
		case 'number':return isFinite(o)?o.toString():'null'
		case 'string':return '"'+o.replace(/(\\|\")/g,"\\$1").replace(/\n/g,"\\n").replace(/\r/g,"\\r")+'"'
		case 'array':
			if(o.length>=0){
				for(var i=0;i<o.length;i++){var v=f(o[i]);if (v!==undefined)r.push(v);};return '['+r.join(',')+']';
			}
		case 'object':
			try{for(var p in o){v=f(o[p]);if(v!==undefined)r.push('"'+p+'":'+v);}}catch(e){};return '{'+r.join(',')+'}'
	}
}

