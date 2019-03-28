```
var TinySandboxBrowser=function(ctx,blackbox,whitebox){
	var obliterate=function(obj, prop) {
		try { delete obj[prop]; if (!obj[prop]) return; } catch(e){}
		try { obj[prop] = undefined; if (!obj[prop]) return; } catch(e){}
		var value;
		if ("__defineGetter__" in obj) {
			try {
				obj.__defineGetter__(prop, function() { return value; });
				obj.__defineSetter__(prop, function(v) { value = v; });
			} catch(ex) {}
		}
		try { obj[prop] = undefined; } catch(ex) {}
	}
	if (!whitebox) whitebox = {
		"setTimeout":undefined, "clearTimeout":undefined, "setInterval":undefined, "clearInterval":undefined, 
	}
	if (!blackbox) blackbox='constructor,window,XMLHttpRequest,DOMWindow,Function,eval,execScript,location';
	if (typeof(blackbox)=='object'){ var sa=[]; for(var k in blackbox){ sa.push(k); } blackbox = sa.join(','); }
	var ifrm = document.createElement("iframe");
	ifrm.src='about:blank';
	ifrm.style.display = "none";
	var ref = document.getElementsByTagName('script')[0];
	ref.parentNode.insertBefore(ifrm, ref);//IMPORTANT: by doing so works
	var windowInstance = ifrm['contentWindow'];
	for (var k in windowInstance) { if (k in whitebox) continue; obliterate(windowInstance, k) }
	//NOTES: let setTimeout works...
	var documentInstance = windowInstance['document'];
	documentInstance.open();documentInstance.close();
	for(var k in ctx){ windowInstance[k]=ctx[k] }
	return {
		run:function(code){ //TODO find any jail break leak
			try{
				windowInstance.onerror=function(msg, file, line){console.log({msg,file,line})};
				return windowInstance.eval("(function("+blackbox+"){"+code+"}).apply({})")
			}catch(ex){
				console.log('run.ex=',ex)
				return ex
			}
		}
		,"~":function(){
			ifrm.parentNode.removeChild(ifrm)
			delete ifrm;
			ifrm=null;
			console.log('~ ifrm',ifrm);
		}
	}
}

var sdbx = TinySandboxBrowser({haha:()=>(new Date()),console:{log:console.log}});

//	delete Object.__defineGetter__;console.log(typeof(Function),Object.__defineGetter__);return 888

//NOTES: setTimeout  not working because the eval is stop right away?
console.log('run=',sdbx.run(`
console.log('this=',this);
//console.log('onerror',onerror);
//console.log('location=',typeof(location));
setTimeout(function(){console.log("typeof(location)=",typeof(location))},1111);
//setTimeout(function(){try{location.href='https://wwwgoogle.com'}catch(ex){console.log(ex)}},2222);
//setTimeout(()=>console.log(new Date()),1111);
setInterval(()=>console.log(new Date()),2345);
	//console.log(eval,haha(),typeof(Function),Object);
	//if(typeof(Object)!="undefined")console.log(Object.__defineGetter__,Object.__defineSetter__);
	var k=[];
	var o={};
	var f=function(n){return n*n}
	//console.log(o.prototype,o.__proto__);
	return f(Math.random())
`));

//sdbx['~']()
//sdbx.run('console.log("try again")');

```
