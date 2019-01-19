function MeanAndVariance(a){
	var n=0,sm=0,sq=0;
	for(var v of a){ n+=1;sm+=v;sq+=v*v; }
	var m = sm / n, v = (sq - sm*sm/n) / (n-1);
	return {n,sm,sq,m,v}
}
