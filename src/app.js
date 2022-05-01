const express = require("express");
const bodyParser = require('body-parser')
// const multer = require("multer");
const fs = require('fs');
const cors = require('cors');


/** bases **************************************** */

const apiBaseFull = require("./apiBaseFull")
const apiBaseItem = require("./apiBaseItem")
const apiBaseGameTags = require("./apiGamesTags")
const apiBaseGames = require("./apiBaseGames")

const saverAssets = require('./saverAssets')





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
        saverAssets.removeFolderItem(req.body.id, () => {
            res.json({ mess })
        })
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


/** edit item data *********************************/

app.post('/api/get-item-data', (req, res) => {
    apiBaseItem.getItem(req.body, item => {
        res.json({ item })
    })
})


app.post("/api/remove-file", (req, res) => {
    saverAssets.removeFile(`assets/files/${ req.body.id }/${ req.body.name }`, () => {
        apiBaseItem.removeFile(req.body, mess => {
            res.json({ mess })
        })
    })
})


app.post("/api/upload-file", saverAssets.upload, (req, res) => {
     apiBaseItem.addFile(req.body, req.file, 'files/', mess => {
         res.json({ mess });
     })
});


/** gameTags ***************************************/


app.post('/api/get-games-tags', (req, res) => {
    apiBaseGameTags.getList(req.body, list => {
        res.json({ list })
    })
})
app.post('/api/add-game-tag', (req, res) => {
    apiBaseGameTags.addGameTag(req.body, mess => {
        res.json({ mess })
    })
})



/** projects ************************************************/


app.post('/api/add-game', (req, res) => {
    apiBaseGames.createGame(req.body, mess => {
        res.json({ mess })
    })
})

app.post('/api/remove-game', (req, res) => {
    apiBaseGames.removeGame(req.body, mess => {
        res.json({ mess })
    })
})

app.post('/api/edit-game', (req, res) => {
    apiBaseGames.editGame(req.body, newData => {
        res.json({ newData })
    })
})


app.post('/api/get-games', (req, res) => {
    apiBaseGames.getGames(req.body, list => {
        res.json({ list })
    })
})


/** layers  ************************************************************/


app.post('/api/add-new-layers-list', (req, res) => {
    apiBaseGames.addNewLayersList(req.body, props => {
        res.json({ props })
    })
})

app.post('/api/get-layers', (req, res) => {
    apiBaseGames.getLayers(req.body, props => {
        res.json({ props })
    })
})


app.post('/api/edit-layers', (req, res) => {
    apiBaseGames.editLayers(req.body, mess => {
        res.json({ mess })
    })
})

app.post('/api/remove-layers', (req, res) => {
    apiBaseGames.removeLayers(req.body, props => {
        res.json({ props })
    })
})






/** start  ******************************************/

//var IP = '192.168.0.101' // work
//var IP = '192.168.10.3' // home
var PORT = 3005


//app.listen(PORT, IP); console.log("listen: " + IP + ":" + PORT)
app.listen(PORT);console.log("listen: localhost:" + PORT)




