
// create a table
// pool.query("CREATE TABLE rooms (id INT, name VARCHAR(255))", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })



// pool.query("CREATE TABLE chats (id SERIAL, username VARCHAR(255) , message VARCHAR(255),  room VARCHAR(255) , tijd TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", (err, res) => {
//     console.log(err, res)
//     pool.end()
//   })

// drop a table



//instert
// pool.query("", (err, res) => {
//   console.log(err, res)
//   pool.end()
// })


 // SELECT id FROM rooms WHERE name = '${req.params.uid}'
    // pool.query(`SELECT id FROM rooms WHERE name = '${req.params.uid}'`, function (err, res) {

    //     const data = res.rows;
    //     data.forEach(row => {
    //         console.log(row);



    //         console.log(row.id)


    //         if (err) {
    //             logger.error('Error in DB');
    //             logger.debug(err);
    //             return;
    //         } else {
    //             if (row && row.length) {
    //                 console.log('Case row was found!');
    //                 // do something with your row variable
    //             } else {
    //                 console.log('No case row was found :( !');
    //             }
    //         }
    //     })
    // });
    const {
      Pool,
      Client
  } = require('pg')
  const pool = new Pool({
   user: process.env.SQL_USER ,
   host: process.env.SQL_HOST,
   database: process.env.SQL_DATABASE,
   password: process.env.SQL_PASSWORD,
   port: process.env.SQL_PORT,
  })

pool.query("CREATE TABLE chats_test2 (id SERIAL, username VARCHAR(255) , message VARCHAR(255),  room VARCHAR(255) , tijd TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)", (err, res) => {
    console.log(err, res)
  })

 pool.query("CREATE TABLE roomstest_2 (id SERIAL, name VARCHAR(255))", (err, res) => {
   console.log(err, res)
 })