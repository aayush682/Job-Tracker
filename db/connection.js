const mongoose = require('mongoose');
const mongoURL = process.env.MONGO_URL;

const mongoDBConnection = async () => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(error);
    }
}

mongoDBConnection();