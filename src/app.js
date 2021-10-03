var express = require("express");
var bodyParser = require('body-parser')
const multer = require("multer");
var fs = require('fs');


var baseApiDragonBones = require("./baseApiDragonBones")
var baseApiSets = require('./baseApiSets')


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
app.use(function (req, res, next) {
    // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    // res.setHeader('Access-Control-Allow-Origin', req.header('origin'));
    next();
});

app.use(express.static('www'))
app.use('/files', express.static('assets/files'))
app.use(bodyParser.json())




/** routers **************************************/

app.post('/api/add-item', (req, res) => {
    baseApiDragonBones.createItem(req.body, mess => {
        res.json({ mess })
    })
})


app.post('/api/remove-item', (req, res) => {
    try {
        removeFiles(req.body.id)
    } catch {
        console.log('not delete')
    }
    baseApiDragonBones.removeFromBase(req.body, mess => {
        res.json({ mess })
    })
})


app.post('/api/edit-item', (req, res) => {
    baseApiDragonBones.editItem(req.body, mess => {
        res.json({ mess })
    })
})



app.post('/api/get-item', (req, res) => {
    baseApiDragonBones.getItem(req.body, item => {
        res.json({ item })
    })
})


app.post('/api/get-list', (req, res) => {
    baseApiDragonBones.getList(req.body, list => {
        res.json({ list })
    })
})


app.post("/api/upload-file", upload.single("file"), (req, res) => {
    baseApiDragonBones.addFile(req.body, req.file, 'files/', mess => {
        res.json({ mess });
    })
});


app.post("/api/remove-files", (req, res) => {
    try {
        removeFiles(req.body.id)
    } catch {
        //console.log('not delete')
    }
    res.json({ mess: ['files removed'] })
})


/** sets api ****************************************/

app.post("/api/get-sets-list", (req, res) => {
    baseApiSets.getList(req.body, list => {
        res.json({ list })
    })
})



/** start  ******************************************/

var IP = '192.168.0.101' // work
//var IP = '192.168.10.3' // home
var PORT = 3005


app.listen(PORT, IP); console.log("listen: " + IP + ":" + PORT)
//app.listen(PORT);console.log("listen: localhost:" + PORT)




