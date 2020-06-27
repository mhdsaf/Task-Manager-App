const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient; // initialization process

const ObjectID = mongodb.ObjectID; // creating an object ID

const ID = new ObjectID(); // Creating an object ID. It is made of 12 bytes, most importantly are the first 4 bytes which contain the timestamp (when the document was created). We can use a method to get the time stamp of an ID.

//console.log(`${ID}     ${ID.getTimestamp()}`);

// need to define the database we want to connect to

const connectionURL = 'mongodb://127.0.0.1:27017';

const databaseName = 'TaskManager'; // can be whatever we want. Name of database we will be inserting to and reading from

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error,client)=>{
    if (error) {
       console.log("Error occured");
    } else {
         console.log("Connection success"); 
         const db = client.db(databaseName);
         // db.collection('Users').insertOne({ // Asynchronous function that takes a callback!
         //    Name: 'Isaiah Safieddine',
         //    Age: 15,
         //    _id : 1
         // }, (error, result)=>{
         //       if (error) {
         //          console.log('Query failed')
         //       } else {
         //          console.log(result.ops);
         //       }
         // });
         const func2 = db.collection('Users').insertOne({
            name: "Andrew Mead",
            age: 26
         });
         func2.then((response)=>{
            console.log(response.ops);
         }).catch((response)=>{
            console.log(response.ops);
         })
         //const db = client.db(databaseName);
         // db.collection('Users').insertMany([
         //    {
         //       name:"Omar Malka",
         //       age: 23
         //    },
         //    {
         //       name: "Wehbe",
         //       age: 21
         //    },
         //    {
         //       name: "Safo",
         //       age: 20
         //    }
         // ],(error, response)=>{
         //       if (error) {
         //          console.log(error)
         //       } else {
         //          console.log(response.insertedCount)
         //       }
         // })
         // db.collection('Tasks').insertMany([
         //    {
         //       'Task Title' : 'Shopping',
         //       Location: 'Street 1N'
         //    },
         //    {
         //       'Task Title' : 'Running',
         //       Location: 'Green field'
         //    },
         //    {
         //       'Task Title' : 'Study',
         //       Location : 'Room'
         //    }
         // ],(error, response)=>{
         //       if (error) {
         //          console.log(error);
         //       } else {
         //          console.log(response.ops)
         //       }
         // }); ***********END OF CREATE DOCUMENTS

         //BEGIN OF READING DOCUMENTS
         // db.collection('Users').findOne({
         //    _id : ObjectID('5ecf8836d3912e24cc9b68da')
         // },(error, document)=>{
         //    if (error) {
         //       console.log(error);
         //    } else {
         //       //console.log(document);             
         //    }
         // })
         // db.collection('Users').find().toArray((error, response)=>{
         //    if (error) {
         //       console.log(error)
         //    } else {
         //       response.forEach(element => {
         //          console.log(element);
         //       });
         //    }
         // }) // doesnt have a callback function. Find wont return all the data it has, however it returns a pointer to the data called 'cursor'. We can now change that pointer to different data. One is to change it into an array. Another would be to count the number of entries, e.t.c
         // END OF READING DOCUMENTS.

         // START OF UPDATING DOCUMENTS WITH PROMISES RATHER THAN CALLBACKS
         // const func1 = db.collection('Users').updateOne({
         //    name : 'Wehbe'
         // },{
         //    $set:{
         //       name: 'Wehbeeeeee',
         //       sahbe: "Sahbeeeee"
         //    }
         // });
         // func1.then((msg)=>{
         //    console.log(msg.matchedCount);
         // }).catch((msg)=>{
         //    console.log(msg);
         // })

         // // Another cleaner way to write the promise along side its retur values is :

         // db.collection('Users').updateOne({
         //    name: "Omar Malka"
         // }, {
         //    $set:{
         //       age: 25
         //    }
         // }).then((msg)=>{
         //    console.log(msg.modifiedCount);
         // }).catch((msg)=>{
         //    console.log(msg);
         // })
         // db.collection('Users').updateMany({
         //    Age:20
         // },{
         //    $inc:{
         //       Age: -1
         //    }
         // }).then((msg) => {
         //    console.log(msg.modifiedCount)
         // }).catch((msg)=>{
         //    console.log(msg)
         // })
         // END OF UPDATEING DOCUMENTS

         //START WITH DELETING DOCUMENTS
         // db.collection('Users').deleteOne({
         //    name: "Safo"
         // }).then((msg)=>{
         //    console.log(msg.deletedCount)
         // }).catch((msg)=>{
         //    console.log(msg);
         // })
         //****************************MONGOOSE***************************************** */
         // Mongoose is a ODM library: Object Document Maper. It simply maps javascript objects that we have in our app to documents in MongoDB. It makes the code much more cleaner, and gives us access to a lot more features. 
         
    }

});