var express = require("express");
var dragonBonesBaseApi = require("./base/dragonBonesSlots/dragonBonesBaseApi")
var bodyParser = require('body-parser')
var cors = require('cors')
const multer = require("multer");
var fs = require('fs');


/** saver files *****************************/

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        const dir = `uploads/${req.body.id}`
        fs.exists(dir, exist => {
            if (!exist) {
                fs.mkdir(dir, error => cb(error, dir))
                return cb(null, dir)
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




/** app ******************************************/


var app = express();
var http = require('http').Server(app);
app.use(express.static('uploads'))
app.use(bodyParser.json())
app.use(cors({ origin: 'http://192.168.10.2:9000' }/*{ origin: ['http://192.168.0.101:9000'] }*/));



/** routers **************************************/

app.post('/api/add-item', (req, res) => {
    dragonBonesBaseApi.createItem(req.body, mess => {
        res.json({ mess })
    })
})


app.post('/api/remove-item', (req, res) => {
    dragonBonesBaseApi.removeFromBase(req.body, () => {
        res.json({})
    })
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
    dragonBonesBaseApi.addFile(req.body, req.file, mess => {
        res.json({ mess });
    })
});


/** start  ******************************************/

var IP = '192.168.0.101' // work
//var IP = '192.168.10.2' // home
var PORT = 3010
app.listen(PORT, IP)
console.log("listen: " + IP + ":" + PORT)



 
