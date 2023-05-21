import mongoose from "mongoose";

mongoose.set('strictQuery', true);

const Connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        console.log(`Connected to Database Successfully`);
    } catch (error) {
        console.log('Disconnected', error);
    }
}

export default Connection;