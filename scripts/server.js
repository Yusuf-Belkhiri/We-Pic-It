const express = require('express')
const cors = require('cors');  
const neo4j = require('neo4j-driver');

var app = express()
app.use(express.static(path.join(__dirname, 'public')));

const uri = 'neo4j+s://b352712a.databases.neo4j.io:7687';
const password = "JFXA93MI0snbcfoqW-deluQhQXHCk7Pg7T3ncIQmjOA";
// const uri = 'bolt://127.0.0.1';
// const password = 'wepicit';
const user = 'neo4j';
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session({ database: 'neo4j' });

const userRoutes = require('../routes/userRoutes')
const postRoutes = require('../routes/postRoutes')
const categoryRoutes = require('../routes/categoryRoutes');
const { lookup } = require('dns');
const exp = require('constants');

app.use('/users', userRoutes)
app.use('/posts', postRoutes)
app.use('/categories', categoryRoutes)

app.use(
    cors({
      origin: "*",
    })
  );

app.get('/', function(req, res){
  session.run('MATCH(n:USER) RETURN n LIMIT 25')
      .then(function(result){
          result.records.forEach(function(record){
          console.log(record)
          })
        })
      .catch(function(err){
        console.log(err);
      })
    res.send('It Works!')
})

const port = 5000;
app.listen(port, () => {
    console.log("server is running");
})

module.exports = app;
//module.exports = driver;
// app.listen(app.get("port"), () => {
//   console.log(
//     "Express server listening on port " + app.get("port") + " see docs at /docs"
//   );
// });