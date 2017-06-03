//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

    if (err){
        return console.log('Unable to connect to the MongoDB server.');
    }
    console.log('Conneceted to MongoDB server.');

/*    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if (err){
            return console.log('Unable to insert todo.', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 4));
    });*/

    // db.collection('Users').insertOne({
    //     name: 'Erwan',
    //     age: 21,
    //     location: 'Lille'
    // }, (err, result) => {
    //    if (err){return console.log('Unable to insert the user. ', err);}
    //    console.log(JSON.stringify(result.ops, undefined, 4));
    // });

    db.close();
});

