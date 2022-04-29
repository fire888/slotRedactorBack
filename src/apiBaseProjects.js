var fs = require('fs');
var pathToFiles = 'assets/gamesViews/'
var baseFileName = 'assets/baseViewsProjects.json'





exports.createProject = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {

            const { id, name } = data
            baseContent.push({ id, name })

            const json = JSON.stringify([], null, 4)
            fs.writeFile(`${pathToFiles}${data.id}.json`, json, 'utf8', () => {
                resolve([baseContent, callback])
            })
        })
    })
}


exports.removeFromBase = function (data, callback) {
    openAndCloseBase( function (baseContent) {
        return new Promise(resolve => {

            const removeFromBase = () => {
                baseContent = baseContent.filter(item => item.id !== data.id)
                resolve([baseContent, callback])
            }

            fs.stat(`${pathToFiles}${data.id}.json`, function (err, stats) {
                if (err) {
                    removeFromBase()
                    return;
                }

                fs.unlink(`${pathToFiles}${data.id}.json`,function(err){
                    if (err) {
                        removeFromBase()
                        return;
                    }
                    removeFromBase()
                });
            });

        })

    })
}


exports.editProject = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {

            const { id, name } = data

            let changedItem = null

            for (let i = 0; i < baseContent.length; i++) {
                if (baseContent[i].id === id) {
                    baseContent[i] = { id, name }
                }
            }

            resolve([baseContent, () => callback(changedItem)])
        })
    })
}


exports.getList = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {
            callback(baseContent)
            resolve([baseContent, () => {}])
        })
    })
}



/** single project properties ***************************/

exports.getProjectProps = function (data, callback) {
    openAndCloseGameView(data.id, function (baseContent) {
        return new Promise(resolve => {
            callback(baseContent)
            resolve([baseContent, () => {}])
        })
    })
}

exports.editProjectProps = function (data, callback) {
    openAndCloseGameView(data.id, function (baseContent) {
        return new Promise(resolve => {
            resolve([data.layers, () => {
                callback('success')
            }])
        })
    })
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



const openAndCloseGameView = (id, callBack) => {
    const fileName = `assets/gamesViews/${id}.json`

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