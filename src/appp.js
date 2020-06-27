// file that starts up our application, where we define all the end points!
const express = require('express');

const path = require('path');

require('./db/dbConnect');

const tasks = require('./models/tasks');

const hbs = require('hbs');

const app = express();

const port = process.env.PORT; // initialization for heroku deployment

const userRouter = require('./routes/users');

const taskRouter = require('./routes/tasks');

app.use(express.json()); //automatically parses JSON request into javascript object



//define paths for Express Configuration (static, views, partials)
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname,'../templates/views');
const partialsDirectoryPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine, cutomizing the views path, and configuring partials directory
app.set('view engine','hbs');
app.set('views',viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);
// Setup static directory
app.use(express.static(publicDirectoryPath))

app.use(userRouter);

app.use(taskRouter);
// Done with setup

app.get('', async (req,res)=>{
    let obj;
    try {
        const Prom1 = await tasks.find({});
        if(Prom1){
            obj = Prom1;
        }
    } catch (error) {
        console.log(error);
    }
    res.render('main');
})
app.get('*',(req,res)=>{
    res.render('404page');
});
app.listen(port, ()=>{
    console.log("Server is up on running!");
    console.log(port)
})