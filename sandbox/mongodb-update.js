//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err){
        return console.log('Unable to connect to the MongoDB server.');
    }
    console.log('Conneceted to MongoDB server.');

    // findOneAndUpdate
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5932e043046202ef914bb14a')
    }, {
        $set:{
            completed: true
        }
    }, {returnOriginal: false}).then((result) => {
        console.log(result);
    });

    db.collection('Users').findOneAndUpdate({
        name: 'Jen'
    }, {
        $inc: {age: 1},
        $set: {name: 'Jenna'}
        }, {returnOriginal: false}).then((result) => {
        console.log(result);
    });

    db.close();
});

