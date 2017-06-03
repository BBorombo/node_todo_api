//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err){
        return console.log('Unable to connect to the MongoDB server.');
    }
    console.log('Conneceted to MongoDB server.');

    // deleteMany
    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((results) => {
        console.log(results);
    });

    // deleteOne
    db.collection('Todos').deleteOne({text: 'Eatch lunch'}).then((result) => {
        console.log(result);
    });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log(result);
    });

    db.collection('Users').deleteMany({name: 'Erawn'});

    db.collection('Users').findOneAndDelete({
        _id: new ObjectID('')
    }).then((results) => {
        console.log(JSON.stringify(results, undefined, 4));
    });

    db.close();
});

