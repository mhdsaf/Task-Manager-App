const express = require('express');

const users = require('../models/users');

const tasks = require('../models/tasks');

const JWTokens = require('../models/tokens');

const multer = require('multer');

const jwt = require('jsonwebtoken');

const sharp = require('sharp'); // sharp is a module that provides several options we can perform on images before we store them into the database. 

const {welcomeEmail, goodbyeEmail, changePassword, forgotPassword, support} = require('../emails/accounts');

const authentication = require('../middleware/authentication'); // we are passing the middleware into this files so we can specify what routes are behind authentication
// we do so by passing the function as a second argument. 

const router = new express.Router();

const bcrypt = require('bcryptjs');

// router.post('/users', async (req,res)=>{ // creating a user: upon signing up 
//     // NOTE: we need to generate and store a JWT into the database upon sign up.
//     console.log("creating a user");
//     const User1 = new users(req.body);
//     try {
//         const token = await User1.generateToken();
//         const Prom1 = await User1.save();
//         const sendData = {
//             User: Prom1,
//             token: token
//         }
//         welcomeEmail(User1.email, User1.username, token)
//         res.send(sendData);
        
//     } catch (error) {
//         console.log("error");
//         res.status(401).send(error);
//     }
// });
router.post('/users/new', async (req,res)=>{
    const userEmails = await users.findOne({email: req.body.email});
    if(userEmails==undefined){
        const token = jwt.sign({email: req.body.email, password: req.body.password, username: req.body.username},process.env.privateKey);
        await welcomeEmail(req.body.email, req.body.username, token);
        res.send({msg: "success"})
    }else if (userEmails[0].email===req.body.email) {
        res.send({error: "Email already taken"});
    }else {
        const token = jwt.sign({email: req.body.email, password: req.body.password, username: req.body.username},process.env.privateKey);
        await welcomeEmail(req.body.email, req.body.username, token);
        res.send({msg: "success"});
    }
})
router.get('/users/verify/:token', async (req,res)=>{
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.privateKey);
    console.log(decodedToken.username);
    const obj = {
        username: decodedToken.username,
        email: decodedToken.email,
        password: decodedToken.password
    };
    try {
        const User1 = new users(obj);
        const token1 = await User1.generateToken();
        const Prom1 = await User1.save();
        const sendData = {
            User: Prom1,
            token: token1
        }
        //res.send(sendData);
        res.render('verified',{sendData})
    } catch (error) {
        console.log(error);
    }
})
// the middleware (authentication) will run first, then the route handler!
// over here, we are actually locking down the route
router.get('/users', authentication, async (req,res)=>{ // reading your profile
    res.send(req.foundUser);
})

router.patch('/users/me', authentication, async (req,res)=>{ // updating a user
    const id = req.foundUser._id;
    const keys = Object.keys(req.body);
    let isOk = true;
    keys.forEach(element => {
        if(element=='username' || element=='password' || element=='email'){

        }else{
            isOk = false;
        }
    });
    if(isOk==true){
        try {
            //const Prom1 = await users.findByIdAndUpdate(id,req.body,{new: true, runValidators: true});
            //const Prom1 = await users.updateOne({_id: ObjectID(id)}, req.body);
            const Prom1 = await users.findById(id);
            keys.forEach(element => {
                if(element=='username'){
                    Prom1.username = req.body.username;
                }else if(element == 'email'){
                    Prom1.email = req.body.email;
                }else if(element == 'password'){
                    Prom1.password = req.body.password;
                }
            });
            await Prom1.save();
            if (Prom1) {
                //console.log(keys);
                res.status(200).send(Prom1);
            } else {
                res.status(400).send('No user associated with the inserted ID');
            }
        } catch (error) {
            res.status(401).send(error);
        }
    }else{
        res.status(400).send("Some field(s) that you tried updating don't exist");
    }
})

router.delete('/users/me', authentication, async (req,res)=>{
    // here we are deactivating or deleting a user account. BUT we also need to delete all tasks that this particular use has in the database
    try {
        const Prom1 = await users.findByIdAndDelete(req.foundUser._id);
        if(Prom1){
            // now i want to delete the tasks of the user
            await tasks.deleteMany({author: Prom1._id});
            const sendData = {
                email: Prom1.email,
                username: Prom1.username
            }
            goodbyeEmail(Prom1.email, Prom1.username)
            res.send(sendData);
        }else{
            res.status(400).send("failed")
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req,res)=>{
    const {email, password} = req.body;
    try {
        const Prom1 = await users.findOne({email: email});
        //console.log(Prom1);
        if (!Prom1) {
            res.status(400).send("Unable to login")
        } else {
            await Prom1.clearTokens();
            const Prom2 = await bcrypt.compare(password, Prom1.password);
            if (Prom2) {
                //res.status(200).send("Successfully logged in"); // i dont want to just send a msg, but i want to send also the JWT
                // after the user succesfully logs in, we shall grant that specific user a JWT.
                const token = await Prom1.generateToken(); // we can access the user (Prom1) in the function using this operator. this function needs to be defined in the models file, using shema.methods
                res.status(200).send({token: token});
                //res.render('main', sendData);
            } else {
                res.status(402).send({error: "Unable to login"});
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).send("Server failed");
    }
});

router.post('/users/logout', authentication, async (req,res)=>{
    try {
        req.foundUser.tokens.forEach((element,index) => {
            if (element.token==req.Token) {
                req.foundUser.tokens.splice(index,1);
                //console.log("asd");
            }
        });
        await req.foundUser.save();
        res.send(req.foundUser);
    } catch (error) {
        res.status(500).send('Need to be authenticated!');
    }
});

router.post('/users/logoutAll', authentication, async (req,res)=>{
    try {
        req.foundUser.tokens.splice(0,req.foundUser.tokens.length);
        await req.foundUser.save();   
        res.send({msg: "Logged out from all devices"});
    } catch (error) {
        res.status(500)
    }
});

const uploadFile = multer({ // here we can configure to accept some certain types of files, such as images or pdfs but for this example, we accept all. We also configure the maximum file size
    limits:{
        fileSize: 1000000 // unit in bytes
    },
    fileFilter(req, file, cb){ // this function runs when a user inserts a file. we use it to define what extensions are acceptable
        
        
        cb(undefined, true); // this signals that everything is okay. 
    }
})

router.post('/users/me/avatar', authentication, uploadFile.single('upload1'), async (req,res)=>{ // here we are telling the server: look for a file called 'upload1'
    let buffer = await sharp(req.file.buffer).resize({width: 120, height: 120}).png().toBuffer();
    req.foundUser.profileImg = buffer;
    await req.foundUser.save();
    res.send("Successfully uploaded a profile picture"); // the problem is that if there are some errors, they will be sent in XML not JSON. to fix this, we add a function to the route
}, (err, req, res, next)=>{
    res.status(401).send({Error: err.message});
});

router.delete('/users/me/avatar', authentication, async (req,res)=>{
    req.foundUser.profileImg = undefined;
    await req.foundUser.save();
    res.send("Successfully deleted")
});

router.get('/users/avatar', authentication, async (req,res)=>{
    if (req.foundUser.profileImg!=undefined) {
        let bufferOriginal = req.foundUser.profileImg;
        let imageBase64 = Buffer.from(bufferOriginal).toString('base64');
        res.send({image: imageBase64});
    } else {
        res.status(400).send({error: "User has no image"});
    }
})

/* For changing password while user is signed in */

// router.get('/users/changepassword/:token', async (req,res)=>{
//     const token = req.params.token;
//     try {
//         const decodedToken = jwt.verify(token, process.env.privateKey);
//         const date1 = new Date();
//         const Prom1 = await JWTokens.findOne({token: token})
//         if( date1.getTime()/1000 > (decodedToken.iat + 900) ){
//             throw new Error();
//         }
//         else if(Prom1!=null){
//             throw new Error();
//         }
//         else{
//             const obj = {
//                 token: token
//             }
//             //save the used token to the JWT table in db so it cannot be used later
//             const Token1 = new JWTokens(obj);
//             Token1.save();
//             res.render('changepassword',{});
//         }
//     } catch (error) {
//         console.log("Invalid JWT")
//     }
// })

// router.post('/users/changepassword', authentication, async (req,res)=>{ //sending change password email
//     const user = req.foundUser;
//     const token = await user.generateToken();
//     changePassword(user.email, user.username, token)
// });

router.patch('/users/changepassword', authentication, async (req,res)=>{
    // const Prom1 = await users.findOne({email: req.foundUser.email});
    // Prom1.password = req.body.userPassword;
    // await Prom1.save();
    const oldPass = req.body.password;
    const newPass = req.body.newpassword;
    const Prom1 = await users.findOne({email: req.foundUser.email});
    const bool = await bcrypt.compare(oldPass, Prom1.password);
    if(bool){
        Prom1.password = newPass;
        await Prom1.save();
    }else{
        res.status(400).send({Error: "Invalid Password"});
        //$2a$08$di3BLIeI8HZbAvB2bPqDP.0VsSj7LRVqGfO3g40rTZFOXxQ4n26iu
    }
});

/* User forgot his password */

router.post('/users/forgotpassword', async (req, res)=>{
    try {
        let email = req.body.email;
        let Prom1 = await users.findOne({email: email});
        if (Prom1) {
            console.log(Prom1.username);
            const token = jwt.sign({email: email},process.env.privateKey);
            forgotPassword(email, Prom1.username, token);
        } else {
            throw new Error();
        }
    } catch (error) {
        console.log(error);
    }
});

router.get('/users/forgotpassword/:token', async (req, res)=>{
    const token = req.params.token;
    try {
        const decodedToken = jwt.verify(token, process.env.privateKey);
        const date1 = new Date();
        const Prom1 = await JWTokens.findOne({token: token})
        console.log(decodedToken);
        console.log(decodedToken.email);
        if( date1.getTime()/1000 > (decodedToken.iat + 900) ){
            throw new Error();
        }
        else if(Prom1!=null){
            throw new Error();
        }
        else{
            const obj = {
                token: token
            }
            //save the used token to the JWT table in db so it cannot be used later
            const Token1 = new JWTokens(obj);
            Token1.save();
            res.render('forgotpassword',{
                email: decodedToken.email
            });
        }
    } catch (error) {
        console.log("Invalid JWT")
    }
})

router.patch('/users/resetpass', async (req,res)=>{
    const Prom1 = await users.findOne({email: req.body.userEmail});
    Prom1.password = req.body.userPassword;
    await Prom1.save();
})
// forgot password -> user provides email -> validate if email exists in db -> send email -> 

// defining the router of login page. when the user clicks on the login buton in the main page, he must be redirected to a login page:
router.get('/signuppage', async (req,res)=>{
    res.render('login',{}); 
})
router.get('/loginpage', async (req,res)=>{
    res.render('login1',{}); 
});
router.post('/users/loginverify', async (req,res)=>{
    const {email, password} = req.body;
    try {
        const Prom1 = await users.findOne({email: email});
        //console.log(Prom1);
        if (!Prom1) {
            res.status(400).send({error: "Unable to login"})
        } else {
            //await Prom1.clearTokens();
            const Prom2 = await bcrypt.compare(password, Prom1.password);
            if (Prom2) {
                //res.status(200).send("Successfully logged in"); // i dont want to just send a msg, but i want to send also the JWT
                // after the user succesfully logs in, we shall grant that specific user a JWT.
                const token = await Prom1.generateToken(); // we can access the user (Prom1) in the function using this operator. this function needs to be defined in the models file, using shema.methods
                res.status(200).send({token: token});
                //res.render('main', sendData);
            } else {
                res.status(400).send({error: "Unable to login"});
            }
        }
    } catch (error) {
        console.log(error)
        res.status(400).send("Server failed");
    }
});
router.get('/home', (req,res)=>{
    return res.render('logged')
});
router.get('/main', (req,res)=>{
    return res.render('notlogged')
});
router.get('/profile',(req,res)=>{
    return res.render('profile');
})
router.get('/about',(req,res)=>{
    return res.render('about');
})
router.get('/contact',(req,res)=>{
    return res.render('contact');
})
router.post('/customersupport', async (req,res)=>{
    const email = req.body.email;
    const name = req.body.name;
    const message = req.body.message;
    support(email, name, message);
})
module.exports = router