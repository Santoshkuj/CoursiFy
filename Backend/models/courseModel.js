import {model, Schema} from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true,'Title is required'],
        minLength: [8,'Title must be atleast 8 char'],
        maxLength: [59,'Title should be less thsn 60 char'],
        trim: true
    },
    description: {
        type: String,
        required: [true,'Title is required'],
        minLength: [8,'Title must be atleast 8 char'],
        maxLength: [200,'Title should be less thsn 201 char'],
        trim: true
    },
    category:{
        type: String,
        required: [true,'Catagory is required'],
    },
    thumbnail: {
        public_id: {type: String,required : true},
        public_url: {type: String, required : true},
    },
    lectures: [{
        title: String,
        description: String,
        lecture: {
            public_id: {
                type: String
            },
            secure_url: {
                type: String
            }
        }
    }],
    numbersOfLectures:{
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: true
    },
},{
    timestamps: true
});

const Course = model('course',courseSchema);

export default Course;