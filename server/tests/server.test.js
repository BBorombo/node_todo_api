const expect = require('expect');
const request = require('supertest');
const{ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
   it('should create a new todo', (done) => {
      var text = 'Test todo text';

      request(app)
          .post('/todos')
          .send({text})
          .expect(200)
          .expect((res) => {
            expect(res.body.text).toBe(text);
          })
          .end((err, res) => {
            if (err){
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            })
          });
   });

   it('should not create todo with invalid body data', (done) => {

       request(app)
           .post('/todos')
           .send()
           .expect(400)
           .end((err, res) => {
               if (err){
                   return done(err);
               }

               Todo.find().then((todos) => {
                   expect(todos.length).toBe(2);
                   done();
               }).catch((e) => done(e))
           });
   });

});

describe('GET /todos', () => {
    it('should get all todos', (done) => {

        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todo/:id', () => {
    it('should return todo doc', (done) => {

        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
            .get(`/todo/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for onn object ids', (done) => {

        request(app)
            .get('/todo/123')
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo ', (done) => {

        request(app)
            .delete(`/todo/${todos[1]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[1].text);
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }

                Todo.findById(todos[1]._id).then((todo) => {
                    expect(todo).toNotExist();
                    done();

                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
            .delete(`/todo/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for onn object ids', (done) => {

        request(app)
            .delete('/todo/123')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo ', (done) => {

        var updatedText = 'Updated todo';

        request(app)
            .patch(`/todo/${todos[1]._id.toHexString()}`)
            .expect(200)
            .send({
                text: updatedText,
                completed: true
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {

        var updatedText = 'Updated todo';

        request(app)
            .patch(`/todo/${todos[1]._id.toHexString()}`)
            .expect(200)
            .send({
                text: updatedText,
                completed: false
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedText);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        request(app)
            .patch(`/todo/${new ObjectID()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for onn object ids', (done) => {

        request(app)
            .patch('/todo/123')
            .expect(404)
            .end(done);
    });
});

describe('GET /user/me', () => {
    it('should return user if authenticated ', (done) => {

        request(app)
            .get('/user/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {

        request(app)
            .get('/user/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});


describe('POST /user', () => {
    it('should create a new user', (done) => {

        var email = 'example@example.com';
        var password = 'ldfgdsd';

        request(app)
            .post('/user')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => {
                    done(e);
                }).catch((e) =>done(e))
            });
    });

    it('should return validation errors if request invalid', (done) => {
        var email = 'example.com';
        var password = '2';

        request(app)
            .post('/user')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('should not user if email in use', (done) => {

        var email = users[0].email;
        var password = 'ldfgdsd';
        request(app)
            .post('/user')
            .send({email, password})
            .expect(400)
            .end(done);
    });
});


describe('POST /user/login', () => {
    it('should login user and return auth token ', (done) => {

        var email = users[1].email;
        var password = users[1].password;

        request(app)
            .post('/user/login')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e) =>done(e));
            });
    });

    it('should reject invalid login  ', (done) => {
        var email = users[1].email;
        var password = users[1].password + 'abc';

        request(app)
            .post('/user/login')
            .send({email, password})
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user).toExist();
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) =>done(e));
            });
    });

});