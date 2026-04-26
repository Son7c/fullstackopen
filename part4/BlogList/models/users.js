const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema=mongoose.Schema({
    blogs:[{
      type:Schema.Types.ObjectId,
      ref:'Blog'
    }],
    username:{
      type:String,
      required:true,
      unique:true,
      minLength:3
    },
    passwordHash:{
      type:String,
      required:true,
    },
    name:String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User=mongoose.model('User',userSchema);
module.exports=User;
