//function copy_o2o(o1,o2,o3){var o=o3||o2;for(var k in o){o1[k]=o2[k]}return o1}
//2018.12.30
function copy_o2o(o1,o2,o3){for(var k in (o3||o2)){o1[k]=o2[k]}return o1}

