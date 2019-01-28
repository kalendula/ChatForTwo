const fs = require('fs')
const path = require('path')

var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));
app.get("/users", function(req, res){
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    res.send(users);

});
app.get("/enter", function(req, res){
    var nick = req.param('nick');
    var password = req.param('pass');
    res.sendFile(__dirname+"/public/chat.html");
    var content = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(content);
    var user = null;
    for(var i=0; i<users.length; i++){
        if(users[i].nick===nick){
            user = users[i];
            break;
        }
    }
    if(user){}
    else{
        var user = {id: 1, nick: nick, pass: password};
        var data = fs.readFileSync("users.json", "utf8");
        var users = JSON.parse(data);
        var id = Math.max.apply(Math,users.map(function(o){return o.id;}))
        user.id = id+1;
        users.push(user);
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
    }
});
app.get("/talker",  function (req, res) {
    var from=req.param('from');
    var to=req.param('to');
    var path1 = __dirname+"/chatHistory/"+from+"-"+to+".json";
    var path2 = __dirname+"/chatHistory/"+to+"-"+from+".json";
    var hsr=[];
    if (fs.existsSync(path1)){
    var content = fs.readFileSync(path1, "utf8");
    hsr = JSON.parse(content);
    }
    else {
        var str = {from: "sys", time: Date.now(), msg: "your history is clear!"};
        hsr.push(str);
        var data = JSON.stringify(hsr);
        fs.appendFileSync(path1,data);
        fs.appendFileSync(path2,data);
    }
    res.send(hsr);
});

app.get("/message",  function (req, res) {
    var from=req.param('from');
    var to=req.param('to');
    var msg=req.param('msg');
    var path1 = __dirname+"/chatHistory/"+from+"-"+to+".json";
    var path2 = __dirname+"/chatHistory/"+to+"-"+from+".json";
    var content = fs.readFileSync(path1, "utf8");
    var msgs = JSON.parse(content);
    var str = {from: from, time: Date.now(), msg: msg};
    msgs.push(str);
    var data = JSON.stringify(msgs);
    fs.writeFileSync(path1,data);
    fs.writeFileSync(path2,data);
    res.send(msgs[msgs.length-1]);
});

app.get("/update",  function (req, res) {
    var from=req.param('from');
    var to=req.param('to');
    var time=req.param('time');
    var path1 = __dirname+"/chatHistory/"+from+"-"+to+".json";
    var content = fs.readFileSync(path1, "utf8");
    var msgs = JSON.parse(content);
    var update = [];
    for (let i = 0; i < msgs.length;i++){
        if (msgs[i].time>time){
            update.push(msgs[i]);
        }
    }
    if (update.length==0){
        res.send("");
    }
    else {
        res.send(update);
    }
    
});


app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

