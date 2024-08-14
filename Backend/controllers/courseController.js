import Course from "../models/courseModel.js";
import AppError from "../utils/error.js";
import fs from 'fs/promises';
import cloudinary from 'cloudinary';

const getAllCourses = async function (req,res,next) {
    const courses = await Course.find({}).select('-lectures');
    try {
        res.status(200).json({
            success: true,
            message: 'All courses',
            courses
        })
    } catch (e) {
        return next(new AppError(e.message,500))
    }
};

const getLectureByCourseId = async function (req,res,next) {
    try {
       const {id} = req.params;
       const course = await Course.findById(id);

       res.status(200).json({
        success: true,
        message: 'course lectures fetched successfuly',
        lectures: course.lectures
       })
        }
     catch (e) {
        return next(new AppError(e.message,500))
    }
}

const createCourse = async(req,res,next)=> {
    const {title, description, category, createdBy} = req.body;

    if(!title || !description || !category || !createdBy) {
        return next( new AppError('All fields are required',400))
    }

    const course = await Course.create( {
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id: 'Dummy_ID',
            public_url: 'Dummy_URL',
        },
    });
    if(!course){
        return next(new AppError('course could not be created',500))
    };
    if (!req.file) {
        return next(new AppError('file not uploaded',500))
    }
    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder: 'Backend'
            });
            if(result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.public_url = result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);   
        } catch (error) {
            return next(new AppError(error.message,500))
        }
    }
    await course.save();

    res.status(200).json({
        success: true,
        message: 'Course created successfully',
        course
    })
}

const deleteLectureFromCourse = async (req, res,next) => {
    const { courseId, lectureId } = req.query;

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return next(new AppError('course not found',400))
        }

        // Find the lecture by ID within the course lectures array
        const lectureIndex = course.lectures.findIndex(lecture => lecture._id.toString() === lectureId);

        if (lectureIndex === -1) {
            return next(new AppError('lecture not found in this course',400))
        }

        // Remove the lecture from the lectures array
        course.lectures.splice(lectureIndex, 1);

        // Save the updated course
        await course.save();

        return res.status(200).json({
            success: true,
            message: 'Lecture deleted successfully'
        });
    } catch (error) {
        return next(new AppError(e.message,500))  
    }
};


const updateCourse =async (req,res,next)=> {
    try {
        const{ id } = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {$set: req.body},
            {runValidators: true}
        );
        if(!course){
            return next(new AppError('course could not find',500))
        };
        res.status(200).json({
            success: true,
            message: 'course updated successfully'
        })
    } catch (e) {
      return next(new AppError(e.message,500))  
    }
}

const removeCourse =async (req,res,next) => {
    try {
        const{ id } = req.params;
        const course = await Course.findById(id);
        if(!course){
            return next(new AppError('course could not find',500))
        };
        await Course.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: 'course deleted successfully'
        })
    } catch (e) {
            return next(new AppError(e.message,500))  
          
    }
}

const addLectureToCourseById = async (req,res,next)=> {
    const {title, description} = req.body;
    const {id} = req.params;

    const course = await Course.findById(id);

    if(!course){
        return next(new AppError('course could not find',500))
    };

    const lectureData = {
        title,
        description,
        lecture:{}
    }

    try {
        if (req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder: 'backend',
                resource_type: "video",
                chunk_size : 50000000
            });
             if(result) {
              lectureData.lecture = {
                public_id : result.public_id,
                secure_url : result.secure_url
                }
            }
            fs.rm(`uploads/${req.file.filename}`);
         }
     } catch (e) {
        return next(new AppError(e.message,500))  
     }
    course.lectures.push(lectureData);
    course.numbersOfLectures = course.lectures.length;
    await course.save();
    res.status(200).json({
        success: true,
        message: 'lectures aided',
        course
    })
}
export{
    getAllCourses,
    getLectureByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById,
    deleteLectureFromCourse
}