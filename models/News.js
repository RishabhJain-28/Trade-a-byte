const mongoose = require('mongoose');
const { eventDB } = require("../config/db");

const newsSchema= new mongoose.Schema({
  title:{
    type : String
  },
  body : {
    type:String
  },
  date:{
    type:Date,
    default : Date.now
  }
})

const News = eventDB.model('news',newsSchema);

module.exports = News;