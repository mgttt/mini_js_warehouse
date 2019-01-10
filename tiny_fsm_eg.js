//eg for a tiny Finite-state-machine
//////////////////////////////////////////////////////////////////////////
((biz,fsm_data,step_start)=>{
	//parse fsm from str to obj:
	var fsm_o = fsm_data.split(/[\n\r]+/).reduce(
		(r,e)=>(m=e.replace(/\s/g,'').match(
			/^([a-zA-Z0-9-_]*)(\.([a-zA-Z0-9-_]*)=>([a-zA-Z0-9-_]*))?/
		))&&(r[m[1]]=(r[m[1]]||{}),r[m[1]][m[3]]=m[4],r),{}
	);console.log(fsm_o);
	//TODO check fsm_o
	if(!step_start){ for(var nm in fsm_o){ if(nm){step_start=nm; break}} }

	var fsm_func = (step_name) => biz.call(step_name).then((rst,STS,step_next)=>(
		STS = (rst||{}).STS,
		step_next = (fsm_o[step_name]||{})[STS],
		step_next ? fsm_func(step_next,rst,STS) : rst
	));
	return fsm_func(step_start);

})(logic_o,`
RoundStart        .OK => MaintainSession // keep login
MaintainSession   .OK => CheckData       // collect and analyze data
CheckData         .OK => RoundEndSleep   // sleep & next if no action needed
CheckData         .ST => PerformStrategy // jump calc if action needed
PerformStrategy   .OK => RoundEnd        // skip the sleep
RoundEndSleep     .OK => RoundEnd        // might sleep few seconds
RoundEnd          .OK => RoundStart      // let do next round
`)
.fail(err=>err)
.done(rst=>{
	console.log('fsm.rst=',rst);
});

tinyfsm.js
```
//NOTES: caller may add fsm_o checking for the broken links, whatever.

module.exports = (lgc,fsm_data,step_start)=>{

	//parse fsm from str to obj:
	var fsm_o = (typeof fsm_data=='object') ? fsm_data : fsm_data.split(/[\n\r]+/).reduce(
		(r,e)=>(m=e.replace(/\s/g,'').match(/^(\w*)(\.(\w*)=>(\w*))?/))&&(r[m[1]]=(r[m[1]]||{}),r[m[1]][m[3]]=m[4],r),{}
	);

	//find start:
	if(!step_start){ for(var nm in fsm_o){ if(nm){step_start=nm; break}} }

	//tiny fsm exec engine:
	var fsm_func = (step_name,prev_nm,prev_sts,prev_rst) =>
		lgc[step_name] ? lgc[step_name](prev_rst,prev_nm,prev_sts).then((rst,STS,step_next)=>(
			STS = (rst||{}).STS,
			step_next = (fsm_o[step_name]||{})[STS],
			step_next ? fsm_func(step_next,step_name,STS,rst) : rst
		)) : {STS:'KO',errmsg:'Not Found '+step_name};
	return fsm_func(step_start);
};

```
calling example:
```
const argv2o=a=>a.reduce((r,e)=>(m=e.match(/^(\/|--?)([a-zA-Z0-9-_]*)="?(.*)"?$/))&&(r[m[2]]=m[3])&&r||r,{});
require('./tinyfsm')(require('./LgcHW')(argv2o(process.argv)),`
RoundStart        .OK => MaintainSession // keep login
MaintainSession   .OK => CheckData       // collect and analyze data
CheckData         .OK => RoundEndSleep   // sleep & next if no action needed
CheckData         .ST => PerformStrategy // jump calc if action needed
PerformStrategy   .OK => RoundEndSleep   // skip the sleep
RoundEndSleep     .OK => RoundEnd        // might sleep few seconds
RoundEnd          .OK => RoundStart      // let do next round
`)
	.fail(err=>err)
	.done(rst=>{
		console.log('fsm.rst=',rst);
	});

```

# v3
```
//NOTES: caller may add fsm_o checking for the broken links, whatever.

module.exports = (lgc,fsm_data,step_start)=>{

	//parse fsm from str to obj:
	var fsm_o = (typeof fsm_data=='object') ? fsm_data : fsm_data.split(/[\n\r]+/).reduce(
		(r,e,x,y,z,pt)=>(m=e.replace(/\s/g,'').match(/^(\w+)?(\.(\w*)=>(\w*))?/))&&(pt=m[1]||pt,pt&&(r[pt]=(r[pt]||{}),r[pt][m[3]]=m[4]),r),{}
	);
	//console.log(fsm_o);

	//find start:
	if(!step_start){ for(var nm in fsm_o){ if(nm){step_start=nm; break}} }

	//tiny fsm exec engine:
	var fsm_func = (step_name,prev_nm,prev_sts,prev_rst) =>
		lgc[step_name] ? lgc[step_name](prev_rst,prev_nm,prev_sts).then((rst,STS,step_next)=>(
			STS = (rst||{}).STS,
			step_next = (fsm_o[step_name]||{})[STS],
			step_next ? fsm_func(step_next,step_name,STS,rst) : rst
		)) : require('Q')({STS:'KO',errmsg:(prev_nm)?(prev_nm+'.'+prev_sts+'?=>'+step_name):(step_name)});
	return fsm_func(step_start);
};

/////
const argv2o=a=>a.reduce((r,e)=>(m=e.match(/^(\/|--?)([a-zA-Z0-9-_]*)="?(.*)"?$/))&&(r[m[2]]=m[3])&&r||r,{});
//Usage:
//node me /user= /pass= /pin=
require('./tinyfsm')(require('./LgcHW')(argv2o(process.argv)),`
RoundStart        .OK => MaintainSession // keep login
MaintainSession   .OK => CheckData       // collect and analyze data
CheckData         .OK => RoundEndSleep   // sleep & next if no action needed
                  .ST => PerformStrategy // jump calc if action needed
PerformStrategy   .OK => RoundEndSleep   // skip the sleep
RoundEndSleep     .OK => RoundEnd        // might sleep few seconds
RoundEnd          .OK => RoundStart      // let do next round
`).fail(err=>err).done(rst=>{
	console.log('tinyfsm.rst=',rst);
});

```
