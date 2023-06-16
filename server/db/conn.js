const {MongoClient} = require("mongodb");
const mongoose = require("mongoose");
const Db = process.env.ATLAS_URI; 
mongoose.connect(Db,
  {
    useNewUrlParser: true    
  }
);

const client = new MongoClient(Db); 
var db; 
module.exports = {
  connectToServer: async function (callback) {

    db = await mongoose.connection;
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
      console.log("Connected successfully");
    });


    // console.log("<<<<<<")
    // await client.connect();
    // // mongo.connect(process.env.ATLAS_URI,(err, db)=> {            
    //     _db = client.db("employees");
    //     console.log("Successfully connected to MongoDB.");       
    //     return callback();
    //      // });
  },
 
  getDb: function () {
    return db;
  },
};