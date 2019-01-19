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
console.log(BlackScholesMerton('c',26563,27200,20/365,0.0000,0.0000,0.1563));
console.log(BlackScholesMerton('p',26528,25600,20/365,0.0000,0.0000,0.2043));

