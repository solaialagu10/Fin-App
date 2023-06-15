const {MongoClient} = require("mongodb");

const Db = process.env.ATLAS_URI; 
const client = new MongoClient(Db); 
var _db; 
module.exports = {
  connectToServer: async function (callback) {
    console.log("<<<<<<")
    await client.connect();
    // mongo.connect(process.env.ATLAS_URI,(err, db)=> {            
        _db = client.db("employees");
        console.log("Successfully connected to MongoDB.");       
        return callback();
         // });
  },
 
  getDb: function () {
    return _db;
  },
};