import express from "express";
import cors from 'cors';
import {AppDataSource} from "./db/db";
import {userRoutes} from "./routes/user-routes";
import {authRoutes} from "./feature/auth/route/auth-routes";
import multer from 'multer';


import cookieParser from 'cookie-parser';
import {fileRoutes} from "./feature/file/route/file-routes";



export const app = express()

const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(cookieParser());


const port = process.env.PORT || 5000


app.use("/user", userRoutes)
app.use("/auth", authRoutes)
app.use("/file", fileRoutes)
app.set('trust proxy', true)



const startApp = async ()=>
{
    AppDataSource.initialize().then(() => {
        console.log("Data Source has been initialized!")
        const PORT = 3306
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    }).catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })
}

startApp()
