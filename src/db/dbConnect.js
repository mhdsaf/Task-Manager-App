const mongoose = require('mongoose');

mongoose.connect(process.env.mongoURL,{ // Initialization
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
