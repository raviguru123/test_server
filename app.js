var 
	express = require("express"),
	app 	= express(),
	cors    = require('cors'),
	_		= require('lodash'),
	UTIL    = require('util'),
	MOMENT  = require('moment'),
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
		
		console.log("refId,msgId,ts_request",refId,msgId,ts_request);
		var str = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:Ack xmlns:ns2="http://bbps.org/schema" api="FETCH_REQUEST" refId="13012019153244D2FGQAVMZG17Y145PFKYB" msgId="130120191532443D7PBWSTG4S7JF6AXMN76" RspCd="Successful" ts="2019-01-13T15:32:46+05:30"/>'
		
		var resp = UTIL.format('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:Ack xmlns:ns2="http://bbps.org/schema" api="FETCH_REQUEST" refId="%s" msgId="%s" RspCd="Successful" ts="%s"/>',
			refId,
			msgId,
			ts_request
			);

		curl(refId, msgId, ts_request);
		response.status(200).send(resp);
}



function curl(refId, msgId, ts_request) {
	var body = makeSuccessfulValidationResponse(refId, msgId, ts_request);

	var opts = {
        method : "POST",
        url : 'https://10.101.62.21/bbps/BillFetchResponse/1.0/urn:referenceId:'+refId,
        body : body,
        headers: {
            "Content-Type": "text/xml",
            "isValid": true
        }
    }

	var headerString = ""; 
    Object.keys(opts.headers).forEach(function(key){
        headerString += UTIL.format(" -H \"%s:%s\"",key, opts.headers[key]);
    });
	
	console.log("\n\n\n\n\n");

	console.log("Curl Request:: ", UTIL.format("curl -k -X %s %s -d '%s' \"%s\" ", opts.method, headerString, opts.body, opts.url), "\n\n");    
}




function makeSuccessfulValidationResponse(refId, msgId, ts_request) {
  	var 
  		origInst = "PT01",
        ts 				= MOMENT().format();
        approvalRefNum = MOMENT().format('DDHHmmss')
        dueDate             = '0001-01-01',
        customerName        = 'NA',
        billDate            = '0001-01-01',
        billNumber          = 'NA',
        billPeriod          = 'NA',
        billAmount          = '0',
        complianceReason    = "Unable to get bill details from biller",
        complianceRespCode  = "BFR008";

var 
	 	xmlToSend               = UTIL.format('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
                                '<ns2:BillFetchResponse xmlns:ns2="http://bbps.org/schema">' +
                                '<Head origInst="%s" refId="%s" ts="%s" ver="1.0"/>' +
                                '<Reason responseCode="200" responseReason="Failure" complianceReason="%s" complianceRespCd="%s"/>' +
                                '<Txn msgId="%s" ts="%s"/>' +
                                '<BillerResponse amount="%s" billDate="%s" billNumber="%s" billPeriod="%s" customerName="%s" dueDate="%s">'+
                                '</BillerResponse>' +
                                '</ns2:BillFetchResponse>',
                                origInst,
                                refId,
                                ts,
                                complianceReason,
                                complianceRespCode,
                                msgId,
                                ts_request,
                                billAmount * 100,
                                billDate,
                                billNumber,
                                billPeriod,
                                customerName,
                                dueDate
                                );
    return xmlToSend;
};



app.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log("server is listen in port::"+port);
});
