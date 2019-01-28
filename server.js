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
app.delete("/submit/users/:id", function(req, res){
      
    var id = req.params.id;
    var nick = "";
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var index = -1;
    for(var i=0; i<users.length; i++){
        if(users[i].id==id){
            nick = users[i].nick;
            index=i;
            break;
        }
    }
    if(index > -1){
        var user = users.splice(index, 1)[0];
        var data1 = fs.readFileSync("attempts.json", "utf8");
        var attempts = JSON.parse(data1);
        for(let j=0; j<attempts.length; j++){
        if (deleteCascade(nick)){continue;}
        break;
    }
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send();
    }
});
app.put("/submit/users",  function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var userId = req.body.id;
    var nick = req.body.nick;
    var time = req.body.time;
     
    var data = fs.readFileSync("users.json", "utf8");
    var users = JSON.parse(data);
    var user;
    for(var i=0; i<users.length; i++){
        if(users[i].id==userId){
            user = users[i];
            break;
        }
    }
    if(user){
        user.nick = nick;
        user.time = time;
        var data = JSON.stringify(users);
        fs.writeFileSync("users.json", data);
        res.send(user);
    }
    else{
        res.status(404).send(user);
    }
});


app.get("/submit/att", function(req, res){
    var content = fs.readFileSync("attempts.json", "utf8");
    var attempts = JSON.parse(content);
    res.send(attempts);

});

app.get("/submit/attempts/:id", function(req, res){
      
    var id = req.params.id; 
    var content = fs.readFileSync("attempts.json", "utf8");
    var attempts = JSON.parse(content);
    var attempt = null;
    for(var i=0; i<attempts.length; i++){
        if(attempts[i].id==id){
            attempt = attempts[i];
            break;
        }
    }
    if(attempt){
        res.send(attempt);
    }
    else{
        res.status(404).send();
    }
});

app.post("/submit/attempts", function (req, res) {
     
    if(!req.body) return res.sendStatus(400);
    
    var nick = req.body.nick;
    var time = req.body.time;
    var attempt = {nick: nick, time: time};
     
    var data = fs.readFileSync("attempts.json", "utf8");
    var attempts = JSON.parse(data);
     
    var id = Math.max.apply(Math,attempts.map(function(o){return o.id;}))
    attempt.id = id+1;
    attempts.push(attempt);
    var data = JSON.stringify(attempts);
    fs.writeFileSync("attempts.json", data);
    res.send(attempt);
});
app.delete("/submit/attempts/:id", function(req, res){
      
    var id = req.params.id;
    var data = fs.readFileSync("attempts.json", "utf8");
    var attempts = JSON.parse(data);
    var index = -1;
    for(var i=0; i<attempts.length; i++){
        if(attempts[i].id==id){
            index=i;
            break;
        }
    }
    if(index > -1){
        var attempt = attempts.splice(index, 1)[0];
        var data = JSON.stringify(attempts);
        fs.writeFileSync("attempts.json", data);
        res.send(attempt);
    }
    else{
        res.status(404).send();
    }
});
app.put("/attempts",  function(req, res){
      
    if(!req.body) return res.sendStatus(400);
     
    var attemptId = req.body.id;
    var nick = req.body.nick;
    var time = req.body.time;
     
    var data = fs.readFileSync("attempts.json", "utf8");
    var attempts = JSON.parse(data);
    var attempt;
    for(var i=0; i<attempts.length; i++){
        if(attempts[i].id==attemptId){
            attempt = attempts[i];
            break;
        }
    }
    if(attempt){
        attempt.nick = nick;
        attempt.time = time;
        var data = JSON.stringify(attempts);
        fs.writeFileSync("attempts.json", data);
        res.send(attempt);
    }
    else{
        res.status(404).send(attempt);
    }
});

app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

