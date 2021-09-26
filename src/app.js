var express = require("express");
var dragonBonesBaseApi = require("./dragonBonesBaseApi")
var bodyParser = require('body-parser')
var cors = require('cors')
const multer = require("multer");
var fs = require('fs');


/** saver files *****************************/

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

const upload = multer({ storage });

const removeFiles = (id) => {
    fs.rmdirSync(`${FILES_DIR}/${id}`, { recursive: true }, err => {
        if (err) {
            console.log(err)
        }
    });
}



/** app ******************************************/


var app = express();
var http = require('http').Server(app);
app.use(express.static('www'))
app.use('/files', express.static('assets/files'))
app.use(bodyParser.json())
app.use(cors());



/** routers **************************************/

app.post('/api/add-item', (req, res) => {
    dragonBonesBaseApi.createItem(req.body, mess => {
        res.json({ mess })
    })
})


app.post('/api/remove-item', (req, res) => {
    try {
        removeFiles(req.body.id)
        dragonBonesBaseApi.removeFromBase(req.body, mess => {
            res.json({ mess })
        })
    } catch {
        console.log('not delete')
    }
})


app.post('/api/edit-item', (req, res) => {
    dragonBonesBaseApi.editItem(req.body, mess => {
        res.json({ mess })
    })
})


app.post('/api/get-list', (req, res) => {
    dragonBonesBaseApi.getList(req.body, list => {
        res.json({ list })
    })
})


app.post("/api/upload-file", upload.single("file"), (req, res) => {
    dragonBonesBaseApi.addFile(req.body, req.file, 'files/', mess => {
        res.json({ mess });
    })
});


/** start  ******************************************/

var IP = '192.168.0.101' // work
//var IP = '192.168.10.3' // home
var PORT = 3005


//app.listen(PORT, IP); console.log("listen: " + IP + ":" + PORT)
app.listen(PORT); console.log("listen: localhost:" + PORT)




