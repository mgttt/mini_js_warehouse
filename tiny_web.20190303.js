<script src="q.1.5.1.min.js"></script>
<script>
function getQueryStr(){a=location.search.substr(1);b=location.hash.substr(1);return a+((a&&b)?'&':'')+b}
function getQueryVar(k,r){if(!this._qva||r){var _qva={};getQueryStr().replace(/([^?=&]+)(=([^&]*))?/g,function($0,$1,$2,$3){_qva[$1]=$3});this._qva=_qva};return k?this._qva[k]:this._qva}
function s2o(s){return (new Function('return '+s))()}
function o2s(o){return JSON.stringify(o)}
function o2o(o1,o2,o3,k){for(k in (o3||o2)){o1[k]=o2[k]}return o1}//TODO fix for array..

function getSID(){ return getQueryVar('_s'); }
ajaxq=(function(xhr){return function(u,a,m){
	var dfr=Q.defer();
	var x=new xhr("Microsoft.XMLHTTP");
	x.onerror=function(e){dfr.reject('{"STS":"KO","errmsg":"Network Failed? '+e+'"}');if(e)console.log(e)};
	x.onreadystatechange=function(){if(x.readyState==4){dfr.resolve(x.responseText)}};
	if(!m)m='POST';
	x.open(m,u,true);
	if(m=='POST')x.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	x.send(a);
	return dfr.promise;
}})(typeof(XMLHttpRequest)?XMLHttpRequest:ActiveXObject)
function ajaxqq(api,param){
	return ajaxq(api+'?'+getQueryStr(),o2s(param))
		.fail(function(e){console.log(api+'.err='+e)})
		.then(function(s){return s2o(s)||{STS:"KO",errmsg:s}})
}


function my_alert_q(opts){
	return mg_dlg_q({header:(opts&&opts.title)||'Alert',body:(opts&&opts.msg)||opts||"",actions:{ ok:{ label:' Okay '}}})
}
function my_confirm_q(opts){
	return mg_dlg_q({header:(opts&&opts.title)||'Confirm',body:(opts&&opts.msg)||opts||'Sure?',actions:{ yes:{ label:' YES '}, no:{ label:' N O '}}}).then(function(rst){
		//return Q((rst&&rst.choice)=='yes'?true:false)
		return Q((rst&&rst.choice=='yes')?true:false)
	})
}
function my_dialog_q(opts){
	return mg_dlg_q({header:'Dialog',body:opts.values,template:'#'+opts.tpl_id}).then(function(rst){
		var _c=opts._c||"";
		var _m=opts._m||"";
		if(rst&&rst.data&&rst.choice=='ok'){
			//var _submit_data = (copy_o2o({choice:rst.choice},rst.data,{'mt_id':'','server_id':'','remark':''}));
			var _submit_data = opts.values;
			return ajaxqq(_c+'.'+_m+'.api',_submit_data)
		}else{
			console.log('DEBUG my_dialog_q()',rst);
			return Q(rst);
		}
	})
}
var QOK = Q({STS:'OK'});
var QKO = Q({STS:'KO'});
function isOK(rst){return(rst&&rst.STS=='OK')}
</script>
<link rel="stylesheet" href="mg-dlg.css">
<script src="mg-dlg.js"></script>

