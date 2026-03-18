const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

mongoose.connect(`mongodb+srv://souvikmajee885_db_user:${password}@cluster0.5nl69zj.mongodb.net/?appName=Cluster0`)
  .then(() => console.log('Connected!'));



const phoneSchema=new mongoose.Schema({
  name:String,
  number:String
})

const Phone=mongoose.model('Phone',phoneSchema);

const phone=new Phone({
  name:process.argv[3],
  number:process.argv[4]
})

phone.save()
.then(result=>{
  console.log(result)
  mongoose.connection.close();
})