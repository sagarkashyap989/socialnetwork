const mongoose = require("mongoose");
const user = require("./User");

const ProfileSchema = new mongoose.Schema({

     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
     },
     company:{
        type: String,
     }, 
     website:{
        type: String,
     },
     location:{
        type: String,
     },
     status:{
        type: String,
        required: true
     },
     skills:{
        type: [String],
        required: true
     },
     bio:{
        type: String
     },
     githubUsername:{
        type: String
     }, 
     experience:[
        {
         title:{ type: String,
            required: true},
         company:{
            type:String,
            required: true
         },
         from:{
            type:Date,
            required: true
         },
         location:{
            type: String,
         },
         to: {
            type: Date
         },
         current:{
            type:Boolean,
            default: false
         },
         description:{
            type:String
         }
        }
     ],

     education: [
      {
         school: {
            type: String,
            required: true
          },
          degree: {
            type: String,
            required: true
          },
          fieldOfStudy: {
            type: String,
            required: true
          },
          from: {
            type: Date,
            required: true
          },
          to: {
            type: Date
          },
          current: {
            type: Boolean,
            default: false
          },
          description: {
            type: String
          }
      }
     ],
     date: {
        type: Date
     }

});

module.exports= Profile = mongoose.model("Profile", ProfileSchema);