var fs = require('fs');
var uniqid = require('uniqid')

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
        callback(currentContentBase['items'])
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



const prepareNewData = (scheme, data) => {
    const newData = {}
    const mess = []

    for (let key in scheme) {
        if (key === "id") {
            newData[key] = data.id || uniqid()
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
            if (!data.animationsNames) mess.push('not animationsNames')
            else if (!data.animationsNames.length === 0) mess.push('not animationsNames')
            else newData[key] = data[key]
        }

        if (key === "armatureName") {
            if (!data.armatureName) {
                mess.push('not armatureName')
            } else {
                newData[key] = data[key]
            }
        }

        if (key === "files") {
            if (!data.files) {
                mess.push('no files')
            } else if (data.files.length === 0) {
                mess.push('no files')
            } else {
                newData.files = []

                for (let i = 0; i < scheme['files'].length; i++) {
                    if (!data.files[i]['type-file']) {
                        mess.push('no type-file')
                    }

                    if (!data.files[i]['file']) {
                        mess.push('no file item')
                    }

                    newData['files'].push({
                        'type-file': data.files[i]['type-file'],
                        'file': data.files[i]['file']
                    })
                }
            }
        }
    }
    return { newData, mess }
}
