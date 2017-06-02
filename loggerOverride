function loggerOverride(){
	var optionalParameter = [getTimeStr()];
	for (var i=0;i<arguments.length;i++) optionalParameter[i+1]=arguments[i];
	try{console.log.apply(console,optionalParameter);}catch(ex){}
};

// logger={ log:loggerOverride }
