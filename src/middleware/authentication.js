const jwt = require('jsonwebtoken');

const users = require('../models/users');

const authentication = async (req,res,next) => { //here we define our middleware function. BUT we dont want this function to run before every single route handler. some route hadnlers such as login and sign up aren't behind authentication. so we should specify the specific routes.
    try { // here, we try to validate the user. If he isnt, the catch block will run
        const token = req.header('Authorization').replace('Bearer ','');
        //console.log("user");
        // now we have the token, we need to verify it.
        const decodedToken = jwt.verify(token, process.env.privateKey);
        //console.log(decodedToken);
        // in the JWT generate in the user models file, we decided on the key, and that the token includes the user email. so now, using the token we can access the user's email.
        const user = await users.findOne({email: decodedToken.email, 'tokens.token': token});
        //console.log("aaaaaaaaaaaaaaaaaaaaa")
        //console.log(user);
        if(!user){
            throw new Error();
        }
        req.Token = token; // using this approach, all routes handlers will have access to this variable.
        req.foundUser = user;// send the user with the request to the handler, so that we dont waste time and get the user in the handler another time. 
        next();
    } catch (error) {
        res.status(405).send("Need authentication!")
        // here we dont run next() because we dont want the route handler to run
    }
}
module.exports = authentication;