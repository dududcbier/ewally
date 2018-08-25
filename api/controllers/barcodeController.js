exports.helloWorld = function(req, res) {
    console.log("RECEIVED HELLO WORLD")
    res.json("Hello World!");
}

exports.parseBarcode = function(req, res) {
    console.log("body: " + req.body);
    res.json("Parse barcode: " +  req.body);
}