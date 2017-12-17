function s2o(s){return (new Function('return '+s))()}
function o2s(o){return JSON.stringify(o)}
function copy_o2o(o1,o2,o3){var o=o3||o2;for(var k in o){o1[k]=o2[k]}return o1}
function getQueryStringA(){ if(this._qva) return this._qva; var _qva={}; window.location.search.replace( /([^?=&]+)(=([^&]*))?/g, function( $0, $1, $2, $3 ){ _qva[ $1 ] = $3; });return this._qva=_qva }
function getQueryStr(){return (new String(location.search)).replace(/^\?/g,"")}
function getQueryVar(sVar){ _qva=this._qva=getQueryStringA(); return _qva[sVar]}
function getSID(){ return getQueryVar('_s'); }
function ajaxqq(api,param){
	return ajaxq(api+'?'+getQueryStr(),o2s(param))
		.fail(function(e){console.log(api+'.err='+e)})
		.then(function(s){return s2o(s)||{STS:"KO",errmsg:s}})
}
