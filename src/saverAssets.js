const multer = require("multer");
const fs = require('fs');

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

const removeFiles = (id) => {
    fs.rmdirSync(`${FILES_DIR}/${id}`, { recursive: true }, err => {
        if (err) {
            console.log(err)
        }
    });
}
