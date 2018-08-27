module.exports = function(app) {
    var typedLine = require('../controllers/typedLineController');

    // Both types of payment slips can be handled by a single endpoint,
    // since we can easily tell them apart
    app.route('/')
        .post(typedLine.parseTypedLine);
};