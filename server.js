const fs = require('fs')
var express = require("express");
const sqlite3 = require('sqlite3').verbose();
var app = express();


app.use(express.static(__dirname + "/public"));

app.get("/users", function(req, res){
    let db = new sqlite3.Database(__dirname+'\\chatHistory\\chatHistory.db', (err) => {
        if (err) {console.error(err.message);}
    });
    let users = [];
    db.each(`SELECT * FROM users`, (err, row) => {
        if (err){ throw err;}
        var e = {nick : row.nick, pass : row.password};
        users.push(e);});
        db.close((err) => {
            if (err) {return console.error(err.message);}
            
    res.send(users);
          });
});

app.get("/enter", function(req, res){
    var nick = req.param('nick');
    var password = req.param('pass');
    var isReg = req.param('isRegister');
    res.sendFile(__dirname+"/public/chat.html");
    if (isReg==="1"){
    let db = new sqlite3.Database(__dirname+'\\chatHistory\\chatHistory.db', (err) => {
        if (err) {console.error(err.message);}
    });
    db.run(`INSERT INTO users(nick, password) VALUES('${nick}','${password}')`); 
    db.run(`Create table ${nick} (talker text, message text, time number)`);   
    db.close((err) => {
        if (err) {return console.error(err.message);}
      });
    }
});

app.get("/talker",  function (req, res) {
    var from=req.param('from');
    var to=req.param('to');
    var hsr=[];
    let db = new sqlite3.Database(__dirname+'\\chatHistory\\chatHistory.db', (err) => {
        if (err) {console.error(err.message);}
    });
    db.each(`SELECT * FROM ${from} where talker='${to}'`, (err, row) => {
        if (err){ throw err;}
        var e = {time : row.time, from : row.talker, message: row.message};
        hsr.push(e);});
    db.each(`SELECT * FROM ${to} where talker='${from}'`, (err, row) => {
        if (err){ throw err;}
        var e = {time : row.time, from : row.talker, message: row.message};
        hsr.push(e);});
        db.close((err) => {
            hsr.sort(function (a,b){return Number(a.time)-Number(b.time)})
            res.send(hsr);
            if (err) {return console.error(err.message);}
            
          });
    
});

app.post("/message",  function (req, res) {
    var from=req.param('from');
    var to=req.param('to');
    var msg=req.param('msg');
    let db = new sqlite3.Database(__dirname+'\\chatHistory\\chatHistory.db', (err) => {
        if (err) {console.error(err.message);}
    });
    db.run(`INSERT INTO ${to} (talker,message, time) VALUES('${from}','${msg}',${Date.now()})`); 
    db.close((err) => {
        if (err) {return console.error(err.message);}
      });
    var e = {msg: msg, from: from, time: Date.now()};
    res.send(e);
});

app.get("/update",  function (req, res) {
        var time = Date.now();
        var from=req.param('from');
        var to=req.param('to');
        var lastTime=req.param('time');
        var hsr=[];
        let db = new sqlite3.Database(__dirname+'\\chatHistory\\chatHistory.db', (err) => {
            if (err) {console.error(err.message);}
        });
        db.each(`SELECT * FROM ${from} where talker='${to}' and time>${lastTime}`, (err, row) => {
            if (err){ throw err;}
            var e = {time : row.time, from : row.talker, msg: row.message};
            hsr.push(e);});
        db.each(`SELECT * FROM ${to} where talker='${from}'  and time>${lastTime}`, (err, row) => {
            if (err){ throw err;}
            var e = {time : row.time, from : row.talker, msg: row.message};
            hsr.push(e);});
            db.close((err) => {
                hsr.sort(function (a,b){return Number(a.time)-Number(b.time)})
                res.send(hsr);
                if (err) {return console.error(err.message);}
                
              });
    
});


app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

