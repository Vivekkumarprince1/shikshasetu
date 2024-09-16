// Connect to DB and start server
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shikshasetu',
    {
        //  useNewUrlParser: true,
        //   useUnifiedTopology: true 
        })
        .then(() => console.log('MongoDB connected'))
        .catch((err) => {
          console.error('MongoDB connection error:', err);
          process.exit(1); // Exit the process with a non-zero status code
        });

    module.exports = mongoose;
