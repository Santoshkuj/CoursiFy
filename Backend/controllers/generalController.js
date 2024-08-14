import AppError from "../utils/error.js";
import Contact from "../models/contactModel.js";

async function getContact(req,res,next) {
    const {name,email,message} = req.body;

    if(!name || !email || !message){
        return next(new AppError('All fields are required',400))
    }
    try {
        const contact = await Contact.create({
            name,
            email,
            message
        });

        await contact.save()

        res.status(200).json({
            success : true,
            message: 'Contact saved'
        })
    } catch (error) {
        return next(new AppError('Contact can not save',400))
    }
}

export default getContact