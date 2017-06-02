const moment = require('moment-timezone');//for datetime
moment.tz.setDefault("Asia/Hong_Kong");

function getTimeStr(dt,fmt){
	if(!dt)dt=new Date();
	if(!fmt)fmt='YYYY-MM-DD HH:mm:ss.SSS';
	return moment(dt).format(fmt);
};
