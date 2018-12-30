// get the 1st match if any:
//function getRegExpMatch(re,s){ var ra=re.exec(s); return (ra && ra[1]) ? ra[1] : "" }
const getRegExpMatch = (re,s) => (re.exec(s)||[])[1]||"";
