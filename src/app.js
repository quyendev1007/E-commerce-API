import express from "express";
import dotenv from "dotenv";
import router from "./routes";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/connectDb";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cors());
app.use(cookieParser());

app.use(morgan("dev"));

app.use(express.static("public"));

app.use("/api", router);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Không thể khởi động server:", err.message);
    process.exit(1);
  }
};

startServer();
