var express = require("express");
var baseApi = require("./base/baseApi")
var bodyParser = require('body-parser')
var cors = require('cors')



var IP = '192.168.0.101'
var PORT = 3010

var app = express();
var http = require('http').Server(app);
app.use(express.static('www'))
app.use(cors({
    origin: ['http://192.168.0.101:9000']
}));
app.use(bodyParser.json())


app.post('/api/add-item', (req, res) => {
    console.log(req.body)
    baseApi.addStroke(req.body)
    res.json({msg: '!!!'})
})



app.listen(PORT, IP)




baseApi.readBase()
setTimeout(() => {
    baseApi.addStroke('aaaaaa')
}, 2000)
setTimeout(() => {
    baseApi.removeStroke('aaaaaa')
}, 2000)



console.log("listen: " + IP + ":" + PORT)



 
