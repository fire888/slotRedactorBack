var fs = require('fs');

var baseFileName = './base/base.json'
var currentContentBase = null


exports.readBase = function () {
    fs.readFile(baseFileName, 'utf8', function (err, file) {
        if (err) {
            return console.log(err);
        }
        currentContentBase = JSON.parse(file)
        console.log(currentContentBase);
    })
}


exports.addStroke = function (stroke) {
    currentContentBase.items.push(stroke)
    console.log(currentContentBase)
    fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase));
}


exports.removeStroke = function () {
    currentContentBase.items.splice(-1, 1)
    console.log(currentContentBase)
    fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase));
}