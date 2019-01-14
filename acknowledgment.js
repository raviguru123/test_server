
var 
	UTIL    = require('util');


function Ack(api, refId, msgId, ts_request, response) {
	this._sendAck(api, refId, msgId, ts_request, response);	
}




Ack.prototype._sendAck = function(api, refId, msgId, ts_request, response) {
	var resp = UTIL.format('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><ns2:Ack xmlns:ns2="http://bbps.org/schema" api="%s" refId="%s" msgId="%s" RspCd="Successful" ts="%s"/>',
			api,
			refId,
			msgId,
			ts_request
			);
	response.status(200).send(resp);
}
