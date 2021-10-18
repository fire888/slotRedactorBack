var fs = require('fs');
var baseFileName = 'assets/baseGamesTags.json'


exports.getList = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {
            callback(baseContent)
            resolve([baseContent, () => {}])
        })
    })
}




const openAndCloseBase = callBack => {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }

        callBack(JSON.parse(fileBase))
            .then(([newContent, onComplete]) => {

                fs.writeFile(baseFileName, JSON.stringify(newContent, null, 4), 'utf8', () => {
                    onComplete('savedSuccess')
                })
            })
    })
}




