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
