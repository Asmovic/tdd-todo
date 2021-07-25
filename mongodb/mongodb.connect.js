const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://asmovic:asmovic@tdd-shard-00-00.0yhgc.mongodb.net:27017,tdd-shard-00-01.0yhgc.mongodb.net:27017,tdd-shard-00-02.0yhgc.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-4a0gro-shard-0&authSource=admin&retryWrites=true&w=majority',
            { useNewUrlParser: true });
    } catch (err) {
        console.log('Error...', err);
    }
}

module.exports = { connect };
