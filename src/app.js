var express = require("express");
var bodyParser = require('body-parser')
const multer = require("multer");
var fs = require('fs');
const cors = require('cors');


var apiBaseFull = require("./apiBaseFull")
var apiBaseItem = require("./apiBaseItem")

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

var corsOptions = {
    origin: 'http://localhost:9000',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));


app.use(express.static('www'))
app.use('/files', express.static('assets/files'))
app.use(bodyParser.json())
var http = require('http').Server(app);



/** routers **************************************/

app.post('/api/add-item', (req, res) => {
    apiBaseFull.createItem(req.body, mess => {
        apiBaseItem.createItem(req.body, mess2 => {
            res.json({ mess: [...mess, ...mess2] })
        })
    })
})


app.post('/api/remove-item', (req, res) => {
    apiBaseFull.removeFromBase(req.body, mess => {
        res.json({ mess })
    })
})


app.post('/api/edit-item', (req, res) => {
    apiBaseFull.editItem(req.body, newData => {
        res.json({ newData })
    })
})


app.post('/api/get-list', (req, res) => {
    apiBaseFull.getList(req.body, list => {
        res.json({ list })
    })
})


/** edit item files data *********************************/

app.post('/api/get-item-data', (req, res) => {
    apiBaseItem.getItem(req.body, item => {
        res.json({ item })
    })
})


app.post("/api/upload-file", upload.single("file"), (req, res) => {
     apiBaseItem.addFile(req.body, req.file, 'files/', mess => {
         res.json({ mess });
     })
});


app.post("/api/upload-image", upload.single("file"), (req, res) => {
    apiBaseItem.addFile(req.body, req.file, 'files/', mess => {
        res.json({ mess });
    })
});


//
//
// app.post("/api/remove-files", (req, res) => {
//     try {
//         removeFiles(req.body.id)
//     } catch {
//         //console.log('not delete')
//     }
//     res.json({ mess: ['files removed'] })
// })



/** start  ******************************************/

var IP = '192.168.0.101' // work
//var IP = '192.168.10.3' // home
var PORT = 3005


app.listen(PORT, IP); console.log("listen: " + IP + ":" + PORT)
//app.listen(PORT);console.log("listen: localhost:" + PORT)




