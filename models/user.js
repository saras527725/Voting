const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//define person scheme or model
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin']
    },
    IsVoted: {
        type: Boolean,
        default: false
    }

})


// Pre-save middleware to hash the password
UserSchema.pre('save', async function (next) {
const user = this;
// Only hash the password if it has been modified (not just saved)
if (!user.isModified('password')) return next();
try{
// Generate a salt
const salt = await bcrypt.genSalt(10);
// Hash the password with the salt
const hashedPassword = await bcrypt.hash(user.password, salt);
// Replace the plaintext password with the hashed one
user.password = hashedPassword;
next();
}catch(err){
    console.error(err); 
}
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
try{
    const isMatch= await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
    }catch(err){
        return err;
}
};


//create person model
const User = mongoose.model('User', UserSchema);
module.exports = User;