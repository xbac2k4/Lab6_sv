const mongoose = require('mongoose')
// mongoose.set('strictQuery', true)

const uri = "mongodb+srv://admin:nxb29122k4@cluster0.t3xxdmo.mongodb.net/md18309"

const connect = async () => {
    try {
        await mongoose.connect( uri,
            {
                useNewUrlParser:true,
                useUnifiedTopology:true,
            })
            console.log('Successfully connected to the server...');
    } catch (error) {
        console.log(error);
        console.log('Connected Fail');
    }
}

module.exports = {connect}