module.exports = function(app) {
    var barcode = require('../controllers/barcodeController');

    app.route('/')
        .get(barcode.helloWorld)
        .post(barcode.parseBarcode);
};