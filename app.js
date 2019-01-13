var 
	express = require("express"),
	app 	= express(),
	cors    = require('cors'),
	_		= require('lodash'),
	UTIL    = require('util'),
	port    = process.env.port || 3000,
	xmlparser  = require('express-xml-bodyparser');


	app.use(xmlparser());
	app.use(cors());



app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});



app.all("*", function(request, response) {
	console.log("starttime",new Date());
	console.log("<<============= request received from outside=============>>");
	console.log("body::", request.rawBody);
	ack(request, response);
	//response.status(200).send("\n<============ok its working===========>\n");
});


function ack(request, response) {
	    var
        self                = this,
        refId               = _.get(request,'body.ns2:billfetchrequest.head.0.$.refId',''),
        msgId               = _.get(request,'body.ns2:billfetchrequest.txn.0.$.msgId','');
		ts_request          = _.get(request,'body.ns2:billfetchrequest.txn.0.$.ts','');
		console.log("*************************************");
		console.log("refId,msgId,ts_request",refId,msgId,ts_request);
		var str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:Ack xmlns:ns2="http://bbps.org/schema" api="FETCH_REQUEST" refId="13012019153244D2FGQAVMZG17Y145PFKYB" msgId="130120191532443D7PBWSTG4S7JF6AXMN76" RspCd="Successful" ts="2019-01-13T15:32:46+05:30"/>'
		
		var resp = UTIL.format('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:Ack xmlns:ns2="http://bbps.org/schema" api="FETCH_REQUEST" refId="%s" msgId="%s" RspCd="Successful" ts="%s"/>',
			refId,
			msgId,
			ts_request
			);
		response.status(200).send(resp);
}



app.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log("server is listen in port::"+port);
});
