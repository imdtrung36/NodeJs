const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect("mongodb://localhost:27017/todoDB", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Đã kết nối MongoDB thành công");
    }catch (err){
        console.error("Lỗi kết nối MongooDB", err.message);
        process.exit(1)
    }
};

module.exports = connectDB;