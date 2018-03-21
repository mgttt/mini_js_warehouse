//ES5
function argv2o(argv){
	var m,mm,rt={};
	for(k in argv)(m=(rt[""+k]=argv[k]).match(/^--?([a-zA-Z0-9-_]*)=(.*)/))&&(rt[m[1]]=(mm=m[2].match(/^".*"$/))?mm[1]:m[2]);
	return rt;
}
function argv2o(argv,m,mm){var rt={};for(k in argv)(m=(rt[""+k]=argv[k]).match(/^(\/|--?)([a-zA-Z0-9-_]*)="?(.*)"?$/))&&(rt[m[2]]=m[3]);return rt}

//ES6
const argv2o=o=>o.reduce((r,e)=>(m=e.match(/^(\/|--?)([a-zA-Z0-9-_]*)="?(.*)"?$/))&&(r[m[2]]=m[3])&&r||r,{});
