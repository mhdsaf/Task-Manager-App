const mongoose = require('mongoose');

const tokensSchema = new mongoose.Schema({
    token:{
        type: String,
        required: true
    }
});

// tokensSchema.methods.checkToken = async function(token){
//     const Prom1 = await JWTokens.findOne({token: token})
//     return Prom1;
// }

const JWTokens = mongoose.model('Tokens', tokensSchema);

module.exports = JWTokens;