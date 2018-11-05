/* eslint-disable */

var schedule = require('node-schedule');
const populateScripts = require('../scripts/index')

var rule = new schedule.RecurrenceRule();
rule.minute = [58,15,30,45];

let development = process.env.NODE_ENV === "development"
console.log(development ? "not scheduling jobs" : "scheduling jobs")
if(!development){
  var j = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the   universe, and everything!');
    populateScripts()
	})
}

//populateScripts()
