//this file contains the user model (table) so that app.js can use it to create new users.
const mongoose = require('mongoose');

const validator = require('validator');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({ // here we created the schema. This gives us an advantage where we can specify several options. The option is a second object parameter  
    username:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    email:{ 
        type: String,
        validate(input){
            if(!validator.isEmail(input)){
                throw new Error('Invalid email');
            }
        },
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        validate(input){
            if(input.length<=6){
                throw new Error('Password is too short. Minimum length is (7)');
            }
            if(input.includes('password')){
                throw new Error('Password should not include password');
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }],
    profileImg: {
        type: Buffer
    }
}, { // this second argument is an object where we define our options
    timestamps: true
});

// NOW IN THE MIDDLE, we can configure ourr middleware functions if we want to use them!
userSchema.methods.generateToken = async function (){
    // here, we can access the document using 'this'
    const token = jwt.sign({email: this.email},process.env.privateKey); //sign takes 2 params. first is the payload, which is an object that has some attributes that uniquely identifies a user. the second is the private key used for digital signatures
    let obj = {
        token: token
    }; // storing the token into the database
    this.tokens.push(obj);
    await this.save();
    return token;
}

userSchema.methods.clearTokens = async function(){
    
    var arr = [];
    const date1 = new Date();
    this.tokens.forEach((element, index) => {
        var decodedToken = jwt.verify(element.token, process.env.privateKey);
        if( date1.getTime()/1000 > (decodedToken.iat + 21600)){
        }else{
            arr.push(element)
        }
    });
    this.tokens = arr;
    await this.save();
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,8);
        next();
    }
})


const Users = mongoose.model('New Users',userSchema); // here we pass the schema to the model! Here the table gets created

//need to export the model so app.js can sue it!
module.exports = Users;