import mongoose from 'mongoose';
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })

        console.log(`Mongo db connected : ${conn.connection.host}`.green.underline)
    } catch (error) {
        console.log(error.message.red.underline)
        process.exit(1)
    }
}


export default connectDB;