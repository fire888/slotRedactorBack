var fs = require('fs');

var baseFileName = './base/sets/base.json'


const currentScheme  = {
    id: "",
    name: 'AAAA',
    currentItemId: null,
    items: []
}



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


exports.addElemToSet = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)

        const messages = []
        for (let i = 0; i < currentContentBase['items'].length; i++) {
            if (currentContentBase['items'][i].id === data.id) {
                const itemBaseData = currentContentBase['items'][i]
                
                itemBaseData.items.push(data.itemId)
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

exports.removeElemFromSet = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)

        const messages = []
        for (let i = 0; i < currentContentBase['items'].length; i++) {
            if (currentContentBase['items'][i].id === data.id) {
                const itemBaseData = currentContentBase['items'][i]
                
                itemBaseData.items = itemBaseData.items.filter(s => data.itemId)
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

exports.setCurrent = function (data, callback) {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase)

        const messages = []
        for (let i = 0; i < currentContentBase['items'].length; i++) {
            if (currentContentBase['items'][i].id === data.id) {
                const itemBaseData = currentContentBase['items'][i]
                
                itemBaseData.currentItemId = data.itemId
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

        if (key === "name") {
            if (!data.name) {
                mess.push('no name')
            }
            newData[key] = ''
        }

        if (key === "currentItemId") {
            if (!data.typeView) {
                mess.push('no currentItemId')
            }
            newData[key] = ''
        }

        if (key === "items") {
            if (!data.items) {
                mess.push('not items')
                newData.items = []
            }
        }
    }
    return { newData, mess }
}
