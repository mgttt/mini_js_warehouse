//in:{
//  CallPriceList:{
//     $S : $P
//  },
//  PutPriceList:{
//     $S : $P
//  },
//  MarketPrice
//}
//out:
// find best r1/r2/delta dynmically

//////////////////////////////////////////////////////////////////////////////
//var _square=function(v){return v*v;};
var _exp=Math.exp;
var _sqrt=Math.sqrt;
var _abs=Math.abs;
var _floor=Math.floor;
var _PI=Math.PI;
var _round=Math.round;
var _pow=Math.pow;
var _log=Math.log;
//@ref https://www.johndcook.com/blog/cpp_phi/
//epsilon < 1.5 × 10^-7
var _cdf = (xx) => {
	var x = _abs(xx) / _sqrt(2.0),
		t = 1.0 / (1.0 + 0.3275911*x),
		y = 1.0 - (((((1.061405429*t + -1.453152027)*t) + 1.421413741)*t + -0.284496736)*t + 0.254829592)*t*_exp(-x*x);
	return 0.5 * (1.0 + y*(xx<0?-1:1) );
};

function BlackScholesMerton(C1P0,K,S,T,r1,r2,d){
	if(!(T>0))T=0;
	var dd = d*_sqrt(T), dd2=d*d/2, df=r1-r2,
		d1 = (_log(K/S)+(df+dd2)*T)/dd,
		d2 = (_log(K/S)+(df-dd2)*T)/dd,
		n = (C1P0==1 || C1P0=='c') ? 1:-1;
	return n*(K*_exp(-r2*T)*_cdf(n*d1)-S*_exp(-r1*T)*_cdf(n*d2))
}
//////////////////////////////////////////////////////////////////////////////
//console.log(BlackScholesMerton('c',26563,27200,20/365,0.0000,0.0000,0.1563));
//console.log(BlackScholesMerton('p',26528,25600,20/365,0.0000,0.0000,0.2043));

function MeanAndVariance(a){
	var n=0,sm=0,sq=0;
	for(var v of a){ n+=1;sm+=v;sq+=v*v; }
	var m = sm / n, v = (sq - sm*sm/n) / (n-1);
	return {n,sm,sq,m,v}
}

var sum_calc = 0;
function Calc(c_a,p_a,r1,r2,dlt,T,K){
	var d_c_a=[];
	var d_p_a=[];
	for(var i=26800;i<=28000;i+=200){
		var bsm_c = BlackScholesMerton('c',K,i,T,r1,r2,dlt);
		var bsm_p = BlackScholesMerton('p',K,i,T,r1,r2,dlt);
		d_c_a.push(bsm_c - c_a[i]);
		d_p_a.push(bsm_p - p_a[i]);
		sum_calc+=2;
	}
	return {c:MeanAndVariance(d_c_a),p:MeanAndVariance(d_p_a)};
}

function Find1(c_a,p_a,T,K){
	var f1=[];
	var mxi=10,mxj=100,mxk=100;
	var fv=9999;
	var fc={};
	for(var i=0;i<mxi;i++){
		for(var j=0;j<mxj;j++){
			for(var k=0;k<mxk;k++){
				var c = Calc(c_a,p_a,i*0.01/mxi,j*0.03/mxj,0.0+k*(0.3-0.0)/mxk,T,K);
				var d = (c.c.v+c.p.v)/2;
				if( d < fv ){
					fv = d, fc = {c,i,j,k,r1:i*0.01/mxi,r2:0.03*j/mxj,dlt:k*0.3/mxk};
					console.log(d,i,j,k);
				}
				f1.push = c;
			}
		}
	}
	return {fv,fc}
}

var c_a = {
	26800:(650+800)/2,
	27000:(512+575)/2,
	27200:(356+418)/2,
	27400:(148+297)/2,
	27600:(199+231)/2,
	27800:(140+150)/2,
	28000:( 82+99 )/2,
};
var p_a = {
	26800:(140+152)/2,
	27000:(150+199)/2,
	27200:(262+278)/2,
	27400:( 38+400)/2,
	27600:(  0+650)/2,
	27800:(  0+1100)/2,
	28000:(722+855)/2,
};
console.log(Find1(c_a,p_a,7/365,27430),sum_calc);
//console.log(Find1(10/365,27360.5),sum_calc);

