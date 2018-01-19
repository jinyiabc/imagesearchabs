//Requirements for mongoose an schema
const mongoose = require('mongoose')
const Schema = mongoose.Schema
//Model
const searchTermSchema = new Schema({
  
                searchVal: String,
                searchDate: Date
          },
          { timestamps: true      // If set timestamps, mongoose assigns createdAt and updatedAt fields to your schema, the type assigned is Date.                                          
          })
//Connects model and collection
const ModelClass = mongoose.model('searchTerm',searchTermSchema)

module.exports = ModelClass
