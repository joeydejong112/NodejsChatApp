
    const {
      Pool,
      Client
  } = require('pg')
  const pool = new Pool({
   user: process.env.SQL_USER,
   host: process.env.SQL_HOST,
   database: process.env.SQL_DATABASE,
   password: process.env.SQL_PASSWORD,
   port: process.env.SQL_PORT,
  
  })

pool.query("CREATE TABLE chats (id SERIAL, username VARCHAR(255) , message VARCHAR(255),  room VARCHAR(255) , tijd TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", (err, res) => {
    console.log(err, res)
  })

 pool.query("CREATE TABLE rooms (id SERIAL, name VARCHAR(255))", (err, res) => {
   console.log(err, res)
 })

 pool.query(`INSERT INTO rooms (name) VALUES ('Chillout place')
`, (err, res) => {
  console.log(err, res)
})
pool.query(`INSERT INTO rooms (name) VALUES ('Nightlife')
`, (err, res) => {
  console.log(err, res)
})
pool.query(`INSERT INTO rooms (name) VALUES ('Series & movies')
`, (err, res) => {
  console.log(err, res)
})
pool.query(`INSERT INTO rooms (name) VALUES ('Sports')
`, (err, res) => {
  console.log(err, res)
})