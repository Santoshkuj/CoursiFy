import mongoose from "mongoose";

mongoose.set('strictQuery',false);

    const dataBaseConnect = async() =>{
        try {
        const {connection} = await mongoose.connect(process.env.MONGODB_URI,{family: 4})
        if(connection) {
            console.log(`Connected to DB: ${connection.host}`);
        }
    } catch(e) {
        console.log(e);
        process.exit(1);
}
    }

    export default dataBaseConnect;