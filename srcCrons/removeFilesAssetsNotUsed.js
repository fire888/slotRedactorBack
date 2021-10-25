var fs = require('fs');
var baseFileName = './assets/files/base.json'
var CONSTANTS = require("../src/constants")
var rimraf = require("rimraf");



const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const getFilesInDirectory = source =>
    fs.readdirSync(source, { withFileTypes: true})
        .map(dirent => dirent.name)


const getUsedItemFiles = (id, callBack) => {
    fs.readFile(`./assets/files/${ id }/elemData.json`, 'utf8', function (err, fileBase) {
        if (err) {
            callBack([]);
            return;
        }

        const arrUsedFiles = []

        if (!fileBase) {
            callBack(arrUsedFiles)
            return;
        }

        const b = JSON.parse(fileBase)
        for (let key in b.files) {
            arrUsedFiles.push(b.files[key].name)
        }
        callBack(arrUsedFiles)
    })
}




const checkIsFileInBaseOrRemove = (fileInDir, filesInBase, folder) => new Promise(resolve => {
    let isInBase = false
    for (let i = 0; i < filesInBase.length; i++) {
        if (fileInDir === filesInBase[i]) {
            isInBase = true
        }
    }

    if (isInBase) {
        resolve()
    } else {
        if (fileInDir === 'elemData.json') {
            resolve()
        } else {
            rimraf(`./assets/files/${folder}/${fileInDir}`, function () {
                console.log('deleted: ', `./assets/files/${folder}/${fileInDir}`)
                resolve()
            })
        }
    }
})





const iterateFilesInBase = (id, filesInBase) => {
    console.log('-------------: ', id)
    return new Promise(resolve => {
        const filesInDir = getFilesInDirectory(`./assets/files/${ id }`)

        const iterateFileInDir = (i) => {
            if (!filesInDir[i]) {
                return resolve()
            }

            checkIsFileInBaseOrRemove(filesInDir[i], filesInBase, id)
                .then(() => {
                    iterateFileInDir(++i)
                })
        }

        iterateFileInDir(0)
    })
}





const iterateDirectory = (i, arrDirectories) => {
    if (!arrDirectories[i]) {
        console.log('done')
        return;
    }

    getUsedItemFiles(arrDirectories[i], filesInBase => {
        iterateFilesInBase(arrDirectories[i], filesInBase)
            .then(() => {
                iterateDirectory(++i, arrDirectories)
            })
    })
}













const start = () => {
    const arrDirectories = getDirectories('./assets/files/')
    console.log(arrDirectories)
    iterateDirectory(0, arrDirectories)
}


start()

/**

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

            const { id, gameTag, typeView, name } = currentContentBase[index]
            arr.push({ "id": id, "gameTag": gameTag || "none", "typeView": typeView, 'name': name })

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
        delete newEmptyObject.name
        delete newEmptyObject.id
        delete newEmptyObject.typeView
        delete newEmptyObject.gameTag

        const json = JSON.stringify(newEmptyObject, null, 4)
        fs.writeFile(`assets/files/${data.id}/elemData.json`, json, 'utf8', () => {
            setTimeout(() => {
                console.log('done', newEmptyObject)
                resolve()
            }, 500)
        });
    })
}

 */
