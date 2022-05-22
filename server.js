//include module for socket.io and mongo db
const mongo = require('mongodb').MongoClient;
const { Server } = require('socket.io');

//start a new socket.io server and listen on port 4000
const PORT = 4000;
const io = new Server();
io.listen(PORT);

//connect to your mongo db on the mongo URl, the callback function returns the db
mongo.connect('mongodb://127.0.0.1/MongoChat',function(err,db){
    if(err){
        throw err;
    }
    
    //connected successfully
    console.log('Mongo Connected...');

    //connect to sockety.io
    io.on('connection',function(){
        let chat = db.collections('chat');

        //funcrtion to send and update status
        function sendStatus(s){
            socket.emit('status',s)
        }

        //retrieve chats form your db
        chat.find().limit().sort
    });
});