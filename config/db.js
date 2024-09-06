const mongoose = require('mongoose');
const connectDB = async () => {
   try {
       const connect = await mongoose.connect('mongodb+srv://cchukwuetoo:chinny_cc12345@cluster0.utmnofs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
           useNewUrlParser: true,
           useUnifiedTopology: true
       });
       console.log(`MongoDB Connected: ${connect.connection.host}`);
   } catch (error) {
       console.error(`DB connection error: ${error.message}`);
       process.exit(1); // Exit process with failure
   }
}
module.exports = connectDB;