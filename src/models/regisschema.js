const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const registerschema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    gmail: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email aready exists',
    },
    phonenumber: {
        type: Number,
        required: true,
        unique: true,
        maxLength: 10
    },
    password: {
        type: String,
        required: true,
    },
    conformpassword: {
        type: String,
        required: true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    Date: {
        type: Date,
        default: Date.now
    }
});
//generating token
registerschema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, "mynameiskevalrabadiyafrombhavnagar");
        this.tokens = this.tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        res.send(error)
    }

}
// password  convert to hash
registerschema.pre("save", async function (next) {

    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        // console.log(`new pass ${this.password}`);
        next();
        this.conformpassword = await bcrypt.hash(this.password, 10);


    }

})

const registermodel = new mongoose.model('registerforms', registerschema);

module.exports = registermodel;