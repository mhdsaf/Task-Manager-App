const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true,
        trim: true
    },
    status:{
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
},{
    timestamps: true
});
const tasks = mongoose.model('New Tasks', taskSchema);

module.exports = tasks;