var fs = require('fs');
var pathToFiles = 'assets/Layers/'
var baseFileName = 'assets/baseViewsProjects.json'





exports.createGame = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {
            baseContent.push(data)
            resolve([baseContent, callback])
        })
    })
}


exports.removeGame = function (data, callback) {
    openAndCloseBase( function (baseContent) {
        return new Promise(resolve => {

            const removeFromBase = () => {
                baseContent = baseContent.filter(item => item.id !== data.id)
                resolve([baseContent, callback])
            }
            removeFromBase()
        })
    })
}


exports.editGame = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {

            let changedItem = null

            for (let i = 0; i < baseContent.length; i++) {
                if (baseContent[i].id === data.id) {
                    baseContent[i] = data
                }
            }

            resolve([baseContent, () => callback(changedItem)])
        })
    })
}


exports.getGames = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {
            callback(baseContent)
            resolve([baseContent, () => {}])
        })
    })
}




/** layers ******************************************/

exports.addNewLayersList = function (data, callback) {
    let json = JSON.stringify([], null, 4)
    fs.writeFile(`${pathToFiles}${data.id}.json`, json, 'utf8', () => {
        if (data.layers) {
            openAndCloseScreenLayers(data.id, function (baseContent) {
                return new Promise(resolve => {
                    resolve([data.layers, () => {
                        callback('success')
                    }])
                })
            })
        } else {
            callback()
        }
    })
}

exports.getLayers = function (data, callback) {
    openAndCloseScreenLayers(data.id, function (baseContent) {
        return new Promise(resolve => {
            callback(baseContent)
            resolve([baseContent, () => {}])
        })
    })
}


exports.editLayers = function (data, callback) {
    openAndCloseScreenLayers(data.id, function (baseContent) {
        return new Promise(resolve => {
            resolve([data.layers, () => {
                callback('success')
            }])
        })
    })
}

exports.removeLayers = function (data, callback) {
    fs.stat(`${pathToFiles}${data.id}.json`, function (err, stats) {
        if (err) {
            console.log('not found file ', `${pathToFiles}${data.id}.json`)
            callback()
        }
        fs.unlink(`${pathToFiles}${data.id}.json`,function(err){
            if (err) {
                return;
            }
            callback('removesuccess')
        });
    });
}






/** helper ***********************************************/


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



const openAndCloseScreenLayers = (id, callBack) => {
    const fileName = `${pathToFiles}${id}.json`

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