import {Router} from 'express';
import { addLectureToCourseById, createCourse, deleteLectureFromCourse, getAllCourses, getLectureByCourseId, removeCourse, updateCourse } from '../controllers/courseController.js';
import { authorizeRoles, authorizeSub, isLoggedIn } from '../middleware/authMiddleware.js';
import upload from '../middleware/multerMiddlewware.js'
const router = Router();

router.route('/').get(getAllCourses)
.post(isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('thumbnail'),
    (createCourse));

router.delete('/',
    isLoggedIn,authorizeRoles('ADMIN'),
    deleteLectureFromCourse);

router.route('/:id').get(isLoggedIn,
    authorizeSub,
    getLectureByCourseId)
.put(isLoggedIn,
    authorizeRoles('ADMIN'),
    updateCourse)
.delete(isLoggedIn,
    authorizeRoles('ADMIN'),
    removeCourse)
.post(
    isLoggedIn,
    authorizeRoles('ADMIN'),
    upload.single('lecture'),
    addLectureToCourseById
);


export default router;