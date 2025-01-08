const mongoose = require('mongoose');
//define person scheme or model
const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    votes: [   //[] -> array ,    user,votedAt -> object
        {
            user: {
                type: mongoose.Schema.Types.ObjectId, // provided by mongodb
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,  // provide by mongodb
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }

})
//create candidate model
const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
