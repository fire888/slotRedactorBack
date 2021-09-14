var fs = require('fs');
var FILES_DIR = require('../../app_back')

var baseFileName = './base/dragonBonesSlots/base.json'
var baseScheme = './base/dragonBonesSlots/scheme.json'




exports.createItem = function (data, callback) {
    fs.readFile(baseScheme, 'utf8', function (err, fileScheme) {
        if (err) {
            return console.log(err);
        }
        fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
            if (err) {
                return console.log(err);
            }
            const currentContentBase = JSON.parse(fileBase)
            const currentScheme = JSON.parse(fileScheme)
            const { mess, newData } = prepareNewData(currentScheme, data)

            currentContentBase['items'].push(newData)
            fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
            mess.push('saved')
            callback(mess)
        })
    })
}


exports.removeFromBase = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        let currentContentBase = JSON.parse(fileBase)

        currentContentBase['items'] = currentContentBase['items'].filter(item => item.id !== data.id)
        fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
        callback(['removed'])
    })
}


exports.editItem = function (data, callback) {
    fs.readFile(baseScheme, 'utf8', function (err, fileScheme) {
        if (err) {
            return console.log(err);
        }
        fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
            if (err) {
                return console.log(err);
            }
            const currentContentBase = JSON.parse(fileBase)
            const currentScheme = JSON.parse(fileScheme)
            const { mess, newData } = prepareNewData(currentScheme, data)

            for (let i = 0; i < currentContentBase['items'].length; i++) {
                if (currentContentBase['items'][i].id === data.id) {
                    currentContentBase['items'][i] = newData
                }
            }
            fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4), err => {
                if (err) {
                    console.log(err)                            
                }
                mess.push('saved')
                callback(mess) 
            })
        })
    })
}


exports.getList = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)
        callback(currentContentBase.items)
    })
}


exports.addFile = function (reqBody, fileData, path, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)

        for (let i = 0; i < currentContentBase['items'].length; i++) {
            if (currentContentBase['items'][i].id === reqBody.id) {

                currentContentBase['items'][i].files[reqBody.type] = {
                    path: path + reqBody.id,
                    name: fileData.originalname,
                    fileKey: reqBody.fileKey,
                }
            }
        }
        
        fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
        callback([fileData.originalname + 'loaded'])
    })
}



const prepareNewData = (scheme, data) => {
    const newData = {}
    const mess = []

    for (let key in scheme) {
        if (key === "id") {
            if (!data.id) {
                mess.push('no id')
            } else {
                newData[key] = data.id
            }
        }

        if (key === "typeExec") {
            newData[key] = scheme[key]
        }

        if (key === "typeView") {
            newData[key] = scheme[key]
        }

        if (key === "name") {
            if (!data.name) mess.push('not name')
            else newData[key] = data[key]
        }


        if (key === "animationsNames") {
            if (!data.animationsNames) {
                newData.animationsNames = [null, null, null, null]
            } else if (data.animationsNames.length === 0) {
                newData.animationsNames = [null, null, null, null]
                mess.push('not animationsNames')
            } else {
                let isHasAnimations = false

                for (let i = 0; i < data.animationsNames.length; i++) {
                    (data.animationsNames[i] !== null && data.animationsNames[i] !== '') && (isHasAnimations = true)
                }

                if (isHasAnimations) {
                    newData[key] = data[key]
                } else {
                    mess.push('not animationsNames')
                }
            }
        }

        if (key === "armatureName") {
            if (!data.armatureName) {
                mess.push('not armatureName')
                newData.armatureName = ""
            } else {
                newData[key] = data[key]
            }
        }

        if (key === "files") {
            if (!data.files) {
                newData.files = {}
            } else {
                newData.files = data.files
            }
        }
    }
    return { newData, mess }
}
