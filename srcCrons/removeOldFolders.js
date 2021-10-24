var fs = require('fs');
var baseFileName = './assets/base.json'
const { readdirSync } = require('fs')
var rimraf = require("rimraf");



const removeFolders = arr => {
    const path = './assets/files'

    const iterate = (i) => {
        if (!arr[i]) {
            console.log('done')
            return; 
        }

        rimraf(`${path}/${arr[i]}`, function () { 
            iterate(++i)
         })
    }

    iterate(0)
}



const getBaseIds  = (callback) => {
    fs.readFile(baseFileName, 'utf8', function (err, fileBase) {
        if (err) {
            return console.log(err);
        }
        const currentContentBase = JSON.parse(fileBase).items
        const arrId = []
        for (let i = 0; i < currentContentBase.length; i++) {
            arrId.push(currentContentBase[i].id)
        }
        callback(arrId)
    })
}



const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)



getBaseIds(arrBaseIds => {
    const arrDirs = getDirectories('./assets/files')

    const arrDirsNotInBase = []
    for (let i = 0; i < arrDirs.length; i++) {
        let isInBase = false
        for (let j = 0; j < arrBaseIds.length; j++) {
            if (arrDirs[i] === arrBaseIds[j]) {
                isInBase = true
            }
        }
        if (!isInBase) {
            arrDirsNotInBase.push(arrDirs[i])
        }
    }


    const arrBaseWithoutItems = []
    for (let j = 0; j < arrBaseIds.length; j++) {
        let isFolder = false 
        for (let i = 0; i < arrDirs.length; i++) {
            if (arrDirs[i] === arrBaseIds[j]) {
                isFolder = true
            }
        }

        if (!isFolder) {
            arrBaseWithoutItems.push(arrBaseIds[j])
        }
    }

    console.log('!!', arrBaseWithoutItems)


    console.log(arrBaseIds.length, arrDirsNotInBase.length, arrDirs.length)
    //removeFolders(arrDirsNotInBase)
})