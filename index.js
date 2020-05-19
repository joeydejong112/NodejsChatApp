const app = require('express')();
const express = require('express');

const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

//Post gres database
app.use(express.static(__dirname + '/public'));

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chat',
  password: 'joeydejong12',
  port: 5432,
})


// create a table
// pool.query("CREATE TABLE users (id INT, username VARCHAR(255) , password VARCHAR(255))", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })



// pool.query("CREATE TABLE chats (id SERIAL, username VARCHAR(255) , message VARCHAR(255),  room VARCHAR(255) , tijd TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", (err, res) => {
//     console.log(err, res)
//     pool.end()
//   })

// drop a table
// pool.query("DROP TABLE chats", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })


//instert
// pool.query("", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })





// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html')
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html')
});
app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html')
});
















// namespaces

const tech = io.of('/tech');



tech.on('connection', (socket) => {
   console.log('user conntected');

   socket.on('join', (data) =>{
    const sessionID = socket.id;

        socket.join(data.room)
        // tech.in(data.room).emit('doei' , `${sessionID} joined ${data.room} room!`)

// chat history private message


pool.query("SELECT * FROM chats WHERE room = 'javascript' ORDER BY tijd ASC", (err, res) => {
    if (err) {
      console.log(err.stack)
    } else {

    const data = res.rows;
    data.forEach(row => {

        tech.to(sessionID).emit('history', `${row.username}` , ` ${row.message}`);

    })



    }
  })


      



   })

   socket.on('message' , (data) =>{
    const sessionID = socket.id;

       console.log(`message : ${data.msg}`);
       tech.in(data.room).emit('message' ,`${sessionID}`, `${data.msg}`);


    //insert chat in database
 
        console.log(data)
        // console.log()
        var sql = `INSERT INTO chats (username, message, room) VALUES ('${sessionID}','${data.msg}','${data.room}')`;
        pool.query( sql, (err, res) => {
            console.log('instert')
        })
    
 

   

   });

   socket.on('disconnect', () =>{
       console.log('user disconnected');
    tech.emit('message' , 'user disconnected')
   })
})




//port 
server.listen(port, () => {
    console.log(`server is running on port ${port}`)
});
