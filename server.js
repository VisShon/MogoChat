//include module for socket.io and mongo db
const mongo = require('mongodb').MongoClient;
const { Server } = require('socket.io');

//start a new socket.io server and listen on port 4000
const PORT = 4000;
const io = new Server({
    cors: {
      origin: "*"
    }
});
io.listen(PORT).sockets;

// server-side
// io.on("connection", (socket) => {
//     socket.emit("hello", "world");
//   });
// io.on("connection", (socket) => {
//     socket.on("hello", (arg) => {
//       console.log(arg); // world
//     });
//   });
  
// client-side
//   socket.on("hello", (arg) => {
//     console.log(arg); // world
//   });
// socket.emit("hello", "world");


//connect to your mongo db on the mongo URl, the callback function returns the db
mongo.connect('mongodb://127.0.0.1/MongoChat',function(err,client){
    db = client.db('MongoChat');
    if(err){
        throw err;
    }
    
    //connected successfully
    console.log('Mongo Connected...');

    //connect to socket.io
    io.on('connection',function(socket){
        let chat = db.collection('Chat');

        //funcrtion to send and update status
        function sendStatus(s){
            socket.emit('status',s)
        }

        //retrieve chats form your db
        chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
            if(err){
                throw err;
            }
            
            //emits the message passed to the callback functions.
            socket.emit('output', res);
        });

        //Recieve message from the client to the server
        socket.on('input', function(message){
            let name = message.name;
            let content = message.content;


            //if the message has no user name or content emit error message to the client
            if(name==''||content==''){
                sendStatus('Please enter a UserName and a Message');
            }else{
                console.log('sent');
                //Insert message into the database
                chat.insertOne({name:name,content:content}, function(){
                    socket.broadcast.emit('output', message);
                    
                });
                //send message sent status to the server
                sendStatus({message: 'Message Sent', clear:true});
            }
        });

        //On clear
        socket.on('clear', function(data){
            chat.deleteMany({},function(){
                //Emit cleared message
                io.emit('cleared')
            });
        });

        socket.on('UpdateOnDatabase', function(){
            io.emit('RefreshPage');
        });
    });
});