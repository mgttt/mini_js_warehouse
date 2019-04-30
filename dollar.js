var dollar=function(s,c){r=(c||document)['getElement'+({'.':'sByClassName','@':'sByName','=':'sByTagName'}[s.charAt(0)]||'ById')](s.slice(1))||[];return(r.length==1)?r[0]:r};

