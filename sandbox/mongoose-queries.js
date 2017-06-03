const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


var id = '59330244411a7407c77cafa4';
var userId = '5932f1f8a4a95d06b9a74159';
if (!ObjectID.isValid(id)){
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos)
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.log('Todo', todo)
});

Todo.findOneById(id).then((todo) => {
    if (!todo){
        return console.log('Id not found');
    }
    console.log('Todo', todo)
}).catch((e) => console.log(e));

User.findById(userId).then((user) => {
    if (!user){
        return console.log('Unable to find user');
    }
    console.log(JSON.stringify(user, undefined, 4));
}, (e) => {
    console.log(e);
});