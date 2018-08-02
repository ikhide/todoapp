const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const app = express();

const port = 3000;

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/todoapp';
 
//set Static path
app.use(express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// views setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');  

//connect to mongo
MongoClient.connect(url, (err,database) => {
    console.log('mongodb connected..');
    if(err) {
        console.log(err);
    }
    
    // db = database;
    // Todos = db.collection('todos');
    //the above works in mongodb2.2.33

    const myDB = database.db('todoapp');
    Todos = myDB.collection('todos');

    app.listen(port, ()=>{
        console.log ("Server is running on port: 3000");
    });
       
});

app.get('/', (req, res, next) =>{
    Todos.find({}).toArray((err, todos)=>{
        if (err) {
            return console.log(err);
        }
        console.log(todos); 
        res.render('index',{
            todos: todos
        });
    });
    
});

app.post('/todo/add',(req,res,next)=>{  
    
    //create todo

    const todo ={
        text: req.body.text,
        body: req.body.body,
        months: req.body.months
    }

    // insert todo
    Todos.insert(todo, (err,result) =>{
        if (err) return console.log(err);
        res.redirect('/');
        console.log('Todo added....');
    });
});

app.delete('/todo/delete/:id', (req,res,next) =>{

    const query = {_id: ObjectID(req.params.id)}
    Todos.deleteOne(query, (err, response) =>{
        if (err){
            return console.log(err);
        }    
        res.sendStatus(200);
        console.log('Todo deleted');
    });

});

app.get('/todo/edit/:id', (req, res, next) =>{
    const query = {_id: ObjectID(req.params.id)}
    Todos.find(query).next((err, todo)=>{
        if (err) {
            return console.log(err);
        } 
        res.render('edit',{
            todo: todo
        });
    });
    
});

app.post('/todo/edit/:id',(req,res,next)=>{
    const query = {_id: ObjectID(req.params.id)}  
    
    //create todo
    const todo = {
        text: req.body.text,
        body: req.body.body,
        months: req.body.months
    }

    //update todo
    Todos.updateOne(query,{$set:todo}, (err,result) =>{
        if (err) return console.log(err);
        res.redirect('/');
        console.log('Todo updated....');
    });
});

    




