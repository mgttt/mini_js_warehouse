function nsr(pathOrKey,r){
var c=(pathOrKey||"").split('.');
for(i=0;i<c.length;i++){k=c[i];if(!k)break;r[k]||(r[k]={});r=r[k];}
return r;
}

/* refer/e.g
function persist(){
			var pathOrKey=arguments[0]||"";
			var r=Session;
			var c=pathOrKey.split('.');
			var p=r;
			var k=null;
			for(i=0;i<c.length;i++){p=r;k=c[i];if(!k)break;r[k]||(r[k]={});r=r[k];}
			if(arguments.length>1){
				if(k){
					r=p[k]=arguments[1];//write to memory
					Storage.setItemSync(server_id +'_' + pathOrKey,r);//persit to storage
				}
			}else{
				if(isEmpty(r)){
					r=Storage.getItemSync(server_id + '_' + pathOrKey);//load from storage
					if(r){
						if(k){
							p[k]=r;//if found, try write back to session as well...
						}
					}
				}
			}
			return r;
		}
*/
