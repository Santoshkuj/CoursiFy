import { model,Schema } from "mongoose";

const contactSchema = new Schema({
    email : {
        type : String,
        required : [true,'Email is required'],
        trim : true
    },
    name : {
        type :String,
        required : [true,'Name is required']
    },
    message : {
        type : String,
        required : [true,'Message is required']
    }
})

const Contact = model ( 'contact',contactSchema);

export default Contact;