const mongoose = require('mongoose');

const url=process.env.MONGODB_URI;
console.log('Connecting to MongoDB');

mongoose.connect(url)
  .then(() => console.log('Connected!'))
  .catch((error)=>console.log('Error connecting to MongoDB',error.message))

const phoneSchema=new mongoose.Schema({
  name:{type:String,
    minLength:3,
    required:true
  },
  number:{type:String,
    minLength:8,
    required:[true,'User Phonenumber required'],
    validate:{
      validator: function(v){
        return /^\d{2,3}-\d+$/.test(v);
      },
      message:props=>`${props.value} is not a valid phone number format! Use XX-XXXXXXX or XXX-XXXXXXX`
    }
  }
});

phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports=mongoose.model('phone',phoneSchema);