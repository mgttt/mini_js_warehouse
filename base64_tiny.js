function(
	a, /* input text */
	b, /* mapping table */
	c, /* working block */
	d, /* input char index */ 
	e /* output text */ ){

	for(
		// initialize char indices
		d=e='';
				
		// cast d to int (floor) 
		// if the next input index does not exist:
 		// 	change the mapping table to "=" 
 		//	check if d has no fractional digits
		a[d|0]||(b='=',d%1);

		e+=b[ 63 & c >>  8 - d % 1 * 8 ] // "8 - d % 1 * 8" generates the sequence 2, 4, 6, 8 (first value for d is 0.75)

	)c = c << 8 | a.charCodeAt( d-=-.75 );  // note: "d -= -3/4" works too

	return e
}

function base64_encode(a,b,c,d,e){for(d=e='';a[d|0]||(b='=',d%1);e+=b[63&c>>8-d%1*8])c=c<<8|a.charCodeAt(d-=-.75);return e}

function base64_decode( data ) {
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i=0, enc='';

  do {  // unpack four hexets into three octets using index points in b64
    h1 = b64.indexOf(data.charAt(i++));
    h2 = b64.indexOf(data.charAt(i++));
    h3 = b64.indexOf(data.charAt(i++));
    h4 = b64.indexOf(data.charAt(i++));

    bits = h1<<18 | h2<<12 | h3<<6 | h4;

    o1 = bits>>16 & 0xff;
    o2 = bits>>8 & 0xff;
    o3 = bits & 0xff;

    if (h3 == 64)   enc += String.fromCharCode(o1);
    else if (h4 == 64) enc += String.fromCharCode(o1, o2);
    else         enc += String.fromCharCode(o1, o2, o3);
  } while (i < data.length);

  return enc;
}
