var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var bullupWebDao = require('./dao/bullup_web_dao.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})); 
app.post('/',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type'); 
    res.send({name:"asd"});
    var data = req.body;
    bullupWebDao.addDate(data,function(err,data){
        console.log("sove ok");
    });
    
});
app.listen(3003,function(){
    console.log("3003 is run");
});