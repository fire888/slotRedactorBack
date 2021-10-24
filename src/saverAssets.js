const multer = require("multer");
const fs = require('fs');
var rimraf = require("rimraf");


/** saver files **************************** */

const FILES_DIR = 'assets/files'


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = `${FILES_DIR}/${req.body.id}`
        fs.exists(dir, exist => {
            if (!exist) {
                fs.mkdir(dir, error => {
                    if (error) {
                        console.log(error)
                    } else {
                        cb(null, dir)
                    }
                })
            } else {
                return cb(null, dir)
            }
        })
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

exports.upload = multer({ storage });

exports.removeFolderItem = (id, callback) => {
    rimraf(`${FILES_DIR}/${id}`, function () { 
        callback()
     });
}

exports.removeFile = (path, callback) => {
    fs.unlink(path, function () {
        callback()
    });
}

