var fs = require('fs');
var pathToFiles = 'assets/files/'
var CONSTANTS = require("../src/constants")





exports.createItem = function (data, callback) {
    const json = JSON.stringify(CONSTANTS.SYMBOL_SCHEME_DEFAULT, null, 4)
    fs.mkdir(`${pathToFiles}${data.id}`, { recursive: true }, err => {
        if (err) {

        } else {
            fs.writeFile(`${pathToFiles}${data.id}/elemData.json`, json, 'utf8', () => {
                callback(['create done'])
            })
        }
    })
}



exports.getItem = function (data, callback) {
    openAndCloseBase(data.id, function (baseContent) {
        return new Promise(resolve => {

            callback(baseContent)

            resolve([baseContent, () => {}])
        })
    })
}


exports.addFile = function (reqBody, fileData, path, callback) {
    openAndCloseBase(reqBody.id, function (baseContent) {
        return new Promise(resolve => {

            baseContent.files[reqBody.type] = {
                path: path + reqBody.id,
                name: fileData.originalname,
                fileKey: reqBody.fileKey,
            }

            resolve([baseContent, () => {
                callback(['loaded'])
            }])
        })
    })
}


exports.removeFile = function (reqBody, callback) {
    openAndCloseBase(reqBody.id, function (baseContent) {
        return new Promise(resolve => {
            delete baseContent.files[reqBody.type]

            resolve([baseContent, () => {
                callback('fileType removed from base')
            }])
        })

    })
}




/** helper ***********************************************/


const openAndCloseBase = (id, callBack) => {
    const fileName = `${pathToFiles}${id}/elemData.json`

    fs.readFile(fileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }

        callBack(JSON.parse(fileBase))
            .then(([newContent, onComplete]) => {

                fs.writeFile(fileName, JSON.stringify(newContent, null, 4), 'utf8', () => {
                    onComplete('savedSuccess')
                })
            })
    })
}




