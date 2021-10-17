var fs = require('fs');
var baseFileName = 'assets/base.json'





exports.createItem = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {

            const { id, gameTag, typeView, name } = data
            baseContent['items'].push({ id, name, gameTag: gameTag || 'none', typeView: 'slot-item' })

            resolve([baseContent, callback])
        })
    })
}


exports.removeFromBase = function (data, callback) {
    openAndCloseBase( function (baseContent) {
        return new Promise(resolve => {

            baseContent['items'] = baseContent['items'].filter(item => item.id !== data.id)

            resolve([baseContent, callback])
        })

    })
}


exports.editItem = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {

            const { id, typeView, gameTag, name } = data

            let changedItem = null

            for (let i = 0; i < baseContent['items'].length; i++) {
                if (baseContent['items'][i].id === id) {
                    changedItem = {
                        id,
                        typeView: typeView || baseContent['items'][i].typeView,
                        gameTag: gameTag || baseContent['items'][i].gameTag,
                        name: name || ''
                    }
                    baseContent['items'][i] = changedItem
                }
            }

            resolve([baseContent, () => callback(changedItem)])
        })
    })
}


exports.getList = function (data, callback) {
    openAndCloseBase(function (baseContent) {
        return new Promise(resolve => {

            if (data.gameTag) {
                const content = baseContent.items.filter(item => item.gameTag === data.gameTag)
                callback(content)
            } else {
                callback(baseContent.items)
            }


            resolve([baseContent, () => {}])
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




