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

/** TODO: renameToDragonBones */
exports.addFile = function (reqBody, fileData, path, callback) {
    console.log('add file')
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

exports.addImage = function (reqBody, fileData, path, callback) {
    console.log('add image')
    openAndCloseBase(reqBody.id, function (baseContent) {
        return new Promise(resolve => {

            baseContent[reqBody.type] = {
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




