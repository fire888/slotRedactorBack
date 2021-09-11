var fs = require('fs');
var uniqid = require('uniqid')
console.log(uniqid())

var baseFileName = './base/dragonBonesSlots/base.json'
var baseScheme = './base/dragonBonesSlots/scheme.json'




exports.saveToBase = function (data) {
    fs.readFile(baseScheme, 'utf8', function (err, fileScheme) {
        if (err) {
            return console.log(err);
        }
        fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
            if (err) {
                return console.log(err);
            }
            const newData = prepareNewData(fileScheme, data)
        })



        currentContentBase = JSON.parse(file)
        console.log(currentContentBase);
    })
}


const prepareNewData = (scheme, data) => {
    const newData = {}
    for (let key in scheme) {
        if (data[key] === "id") {

        }
    }
}

// exports.addStroke = function (stroke) {
//     currentContentBase.items.push(stroke)
//     console.log(currentContentBase)
//     fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase));
// }
//
//
// exports.removeStroke = function () {
//     currentContentBase.items.splice(-1, 1)
//     console.log(currentContentBase)
//     fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase));
// }