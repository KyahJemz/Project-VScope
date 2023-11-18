import mongoose from "mongoose";

const connect = async () => {
  try {

    await mongoose.connect(process.env.MONGO);
    
  } catch (error) {
    console.error("Connection failed:", error.message);
  }
};

export default connect;
