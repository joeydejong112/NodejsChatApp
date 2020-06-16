const app = require('express')();
const express = require('express');

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;



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





// pool.query("DROP TABLE rooms", (err, res) => {
//     console.log(err, res)
//   })
// pool.query("CREATE TABLE roomstest (id SERIAL, name VARCHAR(255))", (err, res) => {
//   console.log(err, res)
// })

// pool.query(`INSERT INTO rooms (name) VALUES ('javascript')
// `, (err, res) => {
//   console.log(err, res)
// })




// Routes
app.get('/', (req, res) => {

    res.sendFile(__dirname + '/public/username.html')
});
app.get('/rooms/:uid', function testfn(req, res, next) {
    var username = req.params.uid;
            res.render(__dirname + '/public/room.html', {
                username: username
                })


});


//global chat room 

var roomid = null;

app.get('/rooms/:uid/:username', function testfn(req, res, next) {
    var room = req.params.uid;
    var username = req.params.username;

            res.render(__dirname + '/public/chat.html', {
                room: room,
                username : username
                })
   

});


const room = io.of('/room');

room.on('connection', (socket) => {

    socket.on('join', (data) => {

        console.log(data);

        const sessionID = socket.id;

        socket.join(data.room)
        room.in(data.room).emit('doei', `${sessionID} joined ${data.room} room!`)

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
        room.in(data.room).emit('message', `${data.username}`, `${data.msg}`);


        //insert chat in database

        console.log(data)
        // console.log()


        var sql = `INSERT INTO chats (username, message, room) VALUES ('${data.username}','${data.msg}','${data.room}')`;
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