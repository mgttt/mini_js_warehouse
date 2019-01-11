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
//maximum error < 1.5 × 10-7
var _cdf=function(x){
	var a1 =  0.254829592;
	var a2 = -0.284496736;
	var a3 =  1.421413741;
	var a4 = -1.453152027;
	var a5 =  1.061405429;
	var p  =  0.3275911;
	var sign= x<0 ? -1 : 1;
	x = _abs(x)/_sqrt(2.0);
	// A&S formula 7.1.26
	var t = 1.0/(1.0 + p*x);
	var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*_exp(-x*x);
	return 0.5*(1.0 + y*sign);
};
//@ref https://en.wikipedia.org/wiki/Black_model
//K  :spot price of the underlying asset
//S  :strike price
//T  :time to maturity (expressed in years)
//r1 : risk free rate (annual rate, expressed in terms of continuous compounding)
//r2 : pay out rate
//d  : volatility of returns of the underlying asset  波幅指数 或 年化标准差,
//     for HSI @ref https://hk.investing.com/indices/hsi-volatility
//     or http://www.quamnet.com/Quote.action?stockCode=VHSI / 100
function BlackScholesMerton(C1P0,K,S,T,r1,r2,d){
	if(T>0){
		var d1 = (_log(K/S)+((r1-r2)+d*d/2)*T)/(d*_sqrt(T));
		//var d2 = d1 - d*_sqrt(T);
		var d2 = (_log(K/S)-((r2-r1)+d*d/2)*T)/(d*_sqrt(T));
		//console.log('d1-d2,d*_sqrt(T)',d1-d2,d*_sqrt(T),d1-d2-d*_sqrt(T));
		return (C1P0==1 || C1P0=='c') ?
			K*_exp(-r2*T)*_cdf(d1)-S*_exp(-r1*T)*_cdf(d2) //Call
			:
			S*_exp(-r1*T)*_cdf(-d2)-K*_exp(-r2*T)*_cdf(-d1) //Put
	}else{
		throw new Error("BlackScholesMerton need t>0");
	}
}
function BlackScholesMerton(C1P0,K,S,T,r1,r2,d){
	if(!(T>0))T=0;
	var d1 = (_log(K/S)+((r1-r2)+d*d/2)*T)/(d*_sqrt(T));
	var d2 = (_log(K/S)-((r2-r1)+d*d/2)*T)/(d*_sqrt(T));
	var n = (C1P0==1 || C1P0=='c') ? 1:-1;
	return n*(K*_exp(-r2*T)*_cdf(n*d1)-S*_exp(-r1*T)*_cdf(n*d2))
}

//////////////////////////////////////////////////////////////////////////////
//console.log(BlackScholesMerton('c',21000,20800,3/365,0.0019,0.0001,0.1363));
//console.log(BlackScholesMerton('c',21000,22800,5/365,0.0019,0.0001,0.1363));
//console.log(BlackScholesMerton('p',21000,22800,3/365,0.0019,0.0001,0.1363));
//console.log(BlackScholesMerton('p',21000,20000,1/365,0.0019,0.0001,0.1363));

//est call price of 27200 when market at 26563 when 20 day to be mature, VHSI 15.63
console.log(BlackScholesMerton('c',26563,27200,20/365,0.0000,0.0000,0.1563));
//est put price of 25600 when market at 26528 when 20 day to be mature, VHSI 20.43
console.log(BlackScholesMerton('p',26528,25600,20/365,0.0000,0.0000,0.2043));

