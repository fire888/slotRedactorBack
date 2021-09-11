var express = require("express");
//var baseApi = require("./base/baseApi")
var dragonBonesBaseApi = require("./base/dragonBonesSlots/dragonBonesBaseApi")
var bodyParser = require('body-parser')
var cors = require('cors')



var IP = '192.168.0.101'
var PORT = 3010

var app = express();
var http = require('http').Server(app);
app.use(express.static('www'))
app.use(cors(/*{ origin: ['http://192.168.0.101:9000'] }*/));
app.use(bodyParser.json())


app.post('/api/add-item', (req, res) => {
    dragonBonesBaseApi.saveToBase(req.body, mess => {
        if (mess[0] !== 'success') {
            res.json({ mess })
        } else {
            res.json({ mess })
        }
    })
})


app.post('/api/remove-item', (req, res) => {
    dragonBonesBaseApi.removeFromBase(req.body, list => {
        res.json({ list })
    })
})


app.post('/api/get-list', (req, res) => {
    dragonBonesBaseApi.getList(req.body, list => {
        res.json({ list })
    })
})


app.listen(PORT, IP)


console.log("listen: " + IP + ":" + PORT)



 
