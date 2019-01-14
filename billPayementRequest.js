var 
	UTIL    = require('util'),
	MOMENT  = require('moment'),
	xmlparser  = require('express-xml-bodyparser'),
	Ack       = require('./acknowledgment.js');




function billPaymentRequest() {

}


billPaymentRequest.prototype.process = function(request, response) {
	   var
        self                = this,
        refId               = _.get(request,'body.ns2:billpaymentrequest.head.0.$.refId',''),
        msgId               = _.get(request,'body.ns2:billpaymentrequest.txn.0.$.msgId','');
		ts_request          = _.get(request,'body.ns2:billpaymentrequest.txn.0.$.ts','');
		
		
		var resp = UTIL.format('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:Ack xmlns:ns2="http://bbps.org/schema" api="PAYMENT_RESPONSE" refId="%s" msgId="%s" RspCd="Successful" ts="%s"/>',
			refId,
			msgId,
			ts_request
			);

		curl(refId, msgId, ts_request);
		response.status(200).send(resp);
}


module.exports = billPaymentRequest;