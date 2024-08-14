import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'
import JWT from 'jsonwebtoken'
import crypto from 'crypto'

const userSchema = new Schema({
    fullName: {
        type: 'string',
        required: [true,"Name is required"],
        minLength: [5,"Name must be atleast 5 character"],
        lowercase: true,
        trim: true
    },
    email: {
        type: 'string',
        required: [true, ' email is required'],
        lowercase: true,
        trim: true,
        unique: true,
    },
    password: {
        type: 'string',
        required: [true,'Password is required'],
        minLength: [8,'minimum 8 character is required'],
        select: false
    },
    avatar: {
        public_id: {
            type: 'string'
        },
        secure_url:{
            type: 'string'
        }
    },
    role: {
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    subscription: {
        id: String,
        status: String
    }
},{
    timestamps: true
});

userSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
});

userSchema.methods = {
    generateJWTToken:async function() {
       return await JWT.sign({
            id: this._id,email: this.email,subscription: this.subscription,role: this.role
        },
        process.env.JWT_SECRET,
        {expiresIn: 24*60*60*1000}
        )
    },
    comparePassword:async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password)
    },
    generatePasswordResetToken: async function() {
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        this.forgotPasswordExpiry = Date.now() + 15*60*1000;

        return resetToken;
    }
}

const User = model('User',userSchema);

export default User;