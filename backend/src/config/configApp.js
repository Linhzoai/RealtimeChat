import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from 'cloudinary';
const configApp = (app) => {
  //cấu hình đọc file .env
  dotenv.config();

  //cấu hình cors
  app.use(
    cors({
      origin: process.env.CLIENT_URL, // PHẢI chỉ định origin cụ thể
      credentials: true, // cho phép cookie
    }),
  );

  //cấu hình parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //Cấu hình file tĩnh
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "../public")));

  //cấu hình cookie
  app.use(cookieParser());

  cloudinary.config({ 
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
          api_key: process.env.CLOUDINARY_API_KEY, 
          api_secret: process.env.CLOUDINARY_API_SECRET
  });
};
export default configApp;
