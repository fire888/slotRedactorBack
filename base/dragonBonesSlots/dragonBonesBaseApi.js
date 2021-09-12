var fs = require('fs');

var baseFileName = './base/dragonBonesSlots/base.json'
var baseScheme = './base/dragonBonesSlots/scheme.json'




exports.saveToBase = function (data, callback) {
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

            if (!mess.length) {
                currentContentBase['items'].push(newData)
                fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
                callback(['success'])
            } else {
                callback(mess)
            }
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
        callback()
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

            if (!mess.length) {
                for (let i = 0; i < currentContentBase['items'].length; i++) {
                    if (currentContentBase['items'][i].id === data.id) {
                        currentContentBase['items'][i] = newData
                    }
                }
                fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
                callback(['success'])
            } else {
                callback(mess)
            }
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


exports.addFile = function (data, fileData, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)

        for (let i = 0; i < currentContentBase['items'].length; i++) {
            if (currentContentBase['items'][i].id === data.id) {
                currentContentBase['items'][i].files[data.type] = { path: data.id, name: fileData.originalname }
            }
        }
        fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
        callback(['success'])
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
                mess.push('not animationsNames')
            } else if (data.animationsNames.length === 0) {
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
            } else {
                newData[key] = data[key]
            }
        }

        if (key === "files") {
            newData.files = {}
        }
    }

    //console.log('!!!', data)
    return { newData, mess }
}
