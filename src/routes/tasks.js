const express = require('express');

const tasks = require('../models/tasks');

const authentication = require('../middleware/authentication');

const router = new express.Router();

/******************CREATING A TASK*********************************** */
router.post('/tasks', authentication, async (req,res)=>{
    const author = req.foundUser._id;
    const Task = new tasks({description: req.body.description, status: req.body.status, author: author}); // a shorter way. the model takes an object as a parameter!
    try {
        const Prom1 = await Task.save();
        res.status(200).send(Prom1);
    } catch (error) {
        res.status(500).send(error);
    }
    // Task.save().then((response)=>{
    //     res.send(response);
    //     //console.log(req);
    // }).catch((error)=>{
    //     res.status(400);
    //     res.send(error.errors);
    // })
});

/******************READING ALL TASKS*********************************** */
router.get('/tasks', authentication, async (req,res)=>{
    // display all the tasks created by a specific user
    try {
        const userID = req.foundUser;
        const Status = req.query.status;
        const Limit = req.query.limit;
        const Skip = req.query.skip;
        const Sort = req.query.sort;
        let sortObj = {};
        if (Sort!=undefined) {
            //console.log(Sort);
            const arr = Sort.split(':');
            const Key = arr[0];
            const Val = arr[1];
            sortObj[Key] = parseInt(Val);
            console.log(sortObj);
        }
        let Prom1;
        if(Status!=undefined){
            if(Sort!=undefined){
                Prom1 = await tasks.find({author:userID, status: req.query.status},null, {limit:parseInt(Limit), skip:parseInt(Skip), sort:sortObj});
            }else{
                Prom1 = await tasks.find({author:userID, status: req.query.status}, null, {limit:parseInt(Limit), skip: parseInt(Skip)});
            }
        }
        else{
            if(Sort!=undefined){
                Prom1 = await tasks.find({author:userID}, null, {limit:parseInt(Limit), skip: parseInt(Skip), sort:sortObj});
            }else{
                Prom1 = await tasks.find({author:userID}, null, {limit:parseInt(Limit), skip: parseInt(Skip)});
            }
        }
        if (Prom1[0]!=undefined) {
            res.status(200).send(Prom1);
        } else {
            res.status(400).send({error:"No tasks yet"});
        }
    } catch (error) {
        res.status(400).send(error);
    }
    // tasks.find({}).then((response)=>{
    //     res.send(response);
    // }).then(()=>{
    //     res.send("No tasks assigned yet!")
    // })
});

router.get('/tasks/:id', authentication, async (req,res)=>{
    // i want to make sure that the user is authenticated + the task he is trying to fetch is actually created by him not by another user
    const id = req.params.id; // task id
    try {
        const Prom1 = await tasks.findById(id);
        if (Prom1) {
            const compareIDs = Prom1.author.equals(req.foundUser._id);
            if(compareIDs == true){
                res.send({
                    Description: Prom1.description,
                    Status: Prom1.status
                })
            }else{
                res.status(405).send({error: "No task associated with the given ID"})
            }
        } else {
            res.status(400).send("Failed");
        }
    } catch (error) {
        res.status(404).send({
            error: "No associated task with given ID"
        });
    }
})
/****************UPDATING A TASK */

router.patch('/tasks/:id', authentication, async (req,res)=>{
    // users can only update tasks that they own!
    const id = req.params.id;
    console.log(req.params.id);
    console.log(req.body);
    //console.log(req.body);
    const keys = Object.keys(req.body);
    let isOk = true;
    keys.forEach(element => {
        if(element=='status' || element=='description'){

        }else{
            isOk = false;
        }
    });
    if(isOk==true){
        try {
            const Prom1 = await tasks.findById(id);
            const compareIDs = Prom1.author.equals(req.foundUser._id);
            if (compareIDs==true) {
                keys.forEach(element => {
                    if(element=='status'){
                        Prom1.status = req.body.status
                    }else if(element=='description'){
                        Prom1.description = req.body.description;
                    }
                });
                await Prom1.save();
                if (Prom1) {
                    res.status(200).send(Prom1);
                } else {
                    res.status(400).send('No task associated with the inserted ID');
                }
            } else {
                res.status(400).send("You can update a task that you didn't create");
            }
        } catch (error) {
            res.status(400).send("No task associated with the inserted ID");
        }
    }else{
        res.status(400).send("Some field(s) that you tried updating are invalid");
    }
})
/*************************DELETING A TASK ************/

router.delete('/tasks/:id',authentication, async (req,res)=>{
    try {
        const id = req.params.id;
        const Prom1 = await tasks.findById(id);
        const compareIDs = Prom1.author.equals(req.foundUser._id);
        if (compareIDs==true) {
            if (Prom1) {
                await tasks.findByIdAndDelete(id);
                res.send(Prom1);
            } else {
                res.status(400).send(Prom1);
            }
        } else {
            res.status(400).send("You cant delete a task that you didnt create")
        }
    } catch (error) {
        res.status(400).send("No task associated with the given ID");
    }
})
router.get('/userTasks/count', authentication, async (req,res)=>{
    let status = req.query.status;
    const id = req.foundUser._id;
    if(status==undefined){
        const Prom1 = await tasks.countDocuments({author: id});
        res.send({count: Prom1});
    }else{
        const Prom1 = await tasks.countDocuments({author: id, status:status});
        res.send({count: Prom1});
    }
})
module.exports = router