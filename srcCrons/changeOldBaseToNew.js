var fs = require('fs');
var baseFileName = './base/dragonBonesSlots/base.json'
var newBase = './base/base.json'
var CONSTANTS = require("../src/constants")



const savesItems = () => {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase).items
        const iterate = index => {
            if (!currentContentBase[index]) {
                console.log('complete')
                return;
            }

            saveAsNew(currentContentBase[index])
                .then(() => { iterate(++index) })
        }

        iterate(0)
    })
}

const saveBase = () => {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase).items
        const arr = []
        const iterate = index => {
            if (!currentContentBase[index]) {
                const savedObj = { items: arr }
                const json = JSON.stringify(savedObj, null, 4)
                console.log(json)
                fs.writeFile(`assets/base.json`, json, 'utf8', () => {
                    setTimeout(() => {
                        console.log('complete')
                    }, 500)
                });

                return;
            }

            const { id, gameTag, typeView } = currentContentBase[index]
            arr.push({ "id": id, "gameTag": gameTag || "none", "typeView": typeView })

            setTimeout(() => { iterate(++index) }, 30)
        }

        iterate(0)
    })
}

//savesItems()
//saveBase()




const saveAsNew = data => {
    return new Promise(resolve => {
        const newEmptyObject = JSON.parse(JSON.stringify(CONSTANTS.SYMBOL_SCHEME))

        Object.assign(newEmptyObject, data)
        delete newEmptyObject.animationsNames
        delete newEmptyObject.armatureName

        const json = JSON.stringify(newEmptyObject, null, 4)
        fs.writeFile(`assets/files/${newEmptyObject.id}/elemData.json`, json, 'utf8', () => {
            setTimeout(() => {
                console.log('done', newEmptyObject.id)
                resolve()
            }, 500)
        });
    })
}










//     const { mess, newData } = prepareBaseObjectFromFront(currentScheme, data, null)
//
//     currentContentBase['items'].push(newData)
//     fs.writeFileSync(baseFileName, JSON.stringify(currentContentBase, null, 4));
//     mess.push('saved')
//     callback(mess)