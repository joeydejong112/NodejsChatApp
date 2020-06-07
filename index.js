const app = require('express')();
const express = require('express');

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
//Post gres database
app.use(express.static(__dirname + '/public'));

const {
    Pool,
    Client
} = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'chat',
    password: 'joeydejong12',
    port: 5432,
})







// Routes
app.get('/', (req, res) => {

    res.sendFile(__dirname + '/public/index.html')
});

//global chat room 

var roomid = null;

app.get('/room/:uid', function testfn(req, res, next) {
var name = req.params.uid;


    res.render(__dirname + '/public/chat.html', {name:name})

   
});


const room = io.of('/room');

room.on('connection', (socket) => {
    socket.on('join', (data) => {
    
        console.log(data);

        const sessionID = socket.id;

        socket.join(data.room)
        room.in(data.room).emit('doei' , `${sessionID} joined ${data.room} room!`)

        // chat history private message


        pool.query(`SELECT * FROM chats WHERE room = '${data.room}' ORDER BY tijd ASC`, (err, res) => {
            if (err) {
                console.log(err.stack)
                console.log(res)
            } else {
                const data = res.rows;
                data.forEach(row => {

                    room.to(sessionID).emit('history', `${row.username}`, ` ${row.message}`);

                })
            }
        })
    })
    socket.on('message', (data) => {
        const sessionID = socket.id;

        console.log(`message : ${data.msg}`);
        room.in(data.room).emit('message', `${sessionID}`, `${data.msg}`);


        //insert chat in database

        console.log(data)
        // console.log()
      

        var sql = `INSERT INTO chats (username, message, room) VALUES ('${sessionID}','${data.msg}','${data.room}')`;
        // var sql = `INSERT INTO rooms (name) VALUES ('javascript')`;  
        pool.query(sql, (err, res) => {
            console.log(sql);
            console.log(res);
        })
    });

    socket.on('disconnect', () => {
        // console.log('user disconnected');
        // room.emit('message', 'user disconnected')
    })
})


//end global chat

//home page section
const home = io.of('/homepage');


home.on('connection', (socket) => {
    console.log('user conntected');

    socket.on('join', (data) => {
        const sessionID = socket.id;

        socket.join(data.room)
        // home.in(data.room).emit('doei' , `${sessionID} joined ${data.room} room!`)

        // chat history private message


        pool.query("SELECT * FROM rooms", (err, res) => {
            if (err) {
                console.log(err.stack)
            } else {

                const data = res.rows;
                data.forEach(row => {
                    console.log(row);
                    home.to(sessionID).emit('history', `${row.name}`);
                    console.log(row.name);

                })
            }
        })
    })

  

    socket.on('disconnect', () => {
      
    })
})



//port 
server.listen(port, () => {
    console.log(`server is running on port ${port}`)
});