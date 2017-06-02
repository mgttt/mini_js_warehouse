const _streamToString=function(stream, cb){
	var str = '';
	stream.on('data', function(chunk){
		str += chunk;
	}).on('end', function(){
		if("undefined"==typeof(s2o)){
			cb({STS:"KO",errmsg:"s2o is undefined"});
		}
		try{
			cb(s2o(str)||{STS:"KO",errmsg:"Unable to understand s:"+str});
		}catch(ex){
			cb({STS:"KO",errmsg:""+ex,str:str});
		}
	}).on('error', function(err){
		cb({STS:"KO",errmsg:""+err,str:str});
	})
	;
};

function StreamToStringPromise(stream,maxTimeout){
	if(!maxTimeout)maxTimeout=3333;
	var dfr=Q.defer();
	setTimeout(()=>{
		dfr.reject({STS:"KO",errmsg:"Timeout("+(maxTimeout/1000)+" sec) when PromiseStreamToString()"});
	},maxTimeout);
	_streamToString(stream,function(rst){
		dfr.resolve(rst);
	});
	return dfr.promise;
}

