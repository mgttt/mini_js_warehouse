//function MeanAndVariance(a){
//	var n=0,sm=0,sq=0;
//	for(var v of a){ n+=1;sm+=v;sq+=v*v; }
//	var m = sm / n, v = (sq - sm*sm/n) / (n-1);
//	return {n,sm,sq,m,v}
//}
function MeanAndVariance(a){
	var n=0,sm=0,sq=0;
	for(var va of a){ n+=1;sm+=va;sq+=va*va; }
	var m = n>0 ? (sm / n) :0, v = (n>1) ? Math.sqrt((sq - sm*sm/n) / (n-1)) : 0;
	return {n,sm,sq,m,v}
}
