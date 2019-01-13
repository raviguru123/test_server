var 
	express = require("express"),
	app 	= express(),
	cors    = require('cors'),
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
	response.status(200).send("\n<============ok its working===========>\n");
});




app.listen(port, function(err) {
	if(err) {
		throw err;
	}
	console.log("server is listen in port::"+port);
})
