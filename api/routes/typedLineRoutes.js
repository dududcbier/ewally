module.exports = function(app) {
    var typedLine = require('../controllers/typedLineController');

    app.route('/')
        .post(typedLine.parseTypedLine);
};