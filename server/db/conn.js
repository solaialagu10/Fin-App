const mongo = require("mongodb").MongoClient;
const Db = process.env.ATLAS_URI; 
var _db; 
module.exports = {
  connectToServer: function (callback) {
    console.log("<<<<<<")
    mongo.connect(process.env.ATLAS_URI,(err, db)=> {            
        _db = db.db("employees");
        console.log("Successfully connected to MongoDB.");       
        return callback(err);
         });
  },
 
  getDb: function () {
    return _db;
  },
};