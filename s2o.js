//using JSON.parse
function s2o(s){try{return JSON.parse(s)}catch(ex){}};

//some time better then JSON.parse()
function s2o(s){try{return(new Function('return '+s))()}catch(ex){}};
