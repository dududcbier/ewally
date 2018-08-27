TypedLine = require('../models/typedLine');

exports.parseTypedLine = function(req, res) {
    let typedLine = new TypedLine(req.body.typedLine);
    res.json({
        "isValid": typedLine.isValid(),
        "value": typedLine.value,
        "expirationDate": typedLine.expirationDate,
        "barcode": typedLine.barcode,
        "type": typedLine.type
    });
}
