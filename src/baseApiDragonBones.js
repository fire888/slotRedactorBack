var fs = require('fs');
var baseFileName = './base/dragonBonesSlots/base.json'










exports.createItem = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)
        const { mess, newData } = prepareBaseObjectFromFront(currentScheme, data, null)

        currentContentBase['items'].push(newData)
        fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
        mess.push('saved')
        callback(mess)
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
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)

        const messages = []
        for (let i = 0; i < currentContentBase['items'].length; i++) {
            if (currentContentBase['items'][i].id === data.id) {
                const itemBaseData = currentContentBase['items'][i]
                const { mess, newData } = prepareBaseObjectFromFront(currentScheme, data, itemBaseData)
                messages.push(...mess)
                currentContentBase['items'][i] = newData
            }
        }
        fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4), err => {
            if (err) {
                console.log(err)
            }
        })
        messages.push('saved')
        callback(messages)
    })
}


exports.getItem = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)
        const item = currentContentBase.items.filter(item => item.id === data.id)[0]
        callback(item)
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
            callback(['wrong'])
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
        callback(['loaded', fileData.originalname])
    })
}



const prepareBaseObjectFromFront = (scheme, data, itemBaseData) => {
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
            if (!data.typeExec) {
                mess.push('no typeExec')
            }
            newData[key] = scheme[key]
        }

        if (key === "typeView") {
            if (!data.typeView) {
                mess.push('no typeView')
            }
            newData[key] = scheme[key]
        }

        if (key === "name") {
            if (!data.name) {
                mess.push('not name')
                newData[key] = ''
            } else {
                newData[key] = data[key]
            }   
        }


        if (key === "animationsNames") {
            if (!data.animationsNames) {
                mess.push('not animationsNames')
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
                    newData[key] = [null, null, null, null]
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

        /** files not saved here. only read from baseSavedObjet or create new empty object */
        if (key === "files") {
            if (itemBaseData && itemBaseData.files) {
                newData.files = itemBaseData.files
            } else {
                mess.push('no files key')
                newData.files = {}
            }
        }
    }
    return { newData, mess }
}
