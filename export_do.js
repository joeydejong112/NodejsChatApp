
    const {
        Pool,
        Client
    } = require('pg')
    const pool = new Pool({
     user: process.env.SQL_USER,
     host: process.env.SQL_HOST,
     database: process.env.SQL_DATABASE,
     password: process.env.SQL_PASSWORD,
     port: process.env.SQL_PORT
  
    })

  
   pool.query("DROP TABLE rooms", (err, res) => {
     console.log(err, res)
   })
   pool.query("DROP TABLE chats", (err, res) => {
    console.log(err, res)
  })