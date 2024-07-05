import express from "express";
import cors from 'cors';
import {AppDataSource} from "./db/db";
import {authRoutes} from "./feature/auth/route/auth.routes";


import cookieParser from 'cookie-parser';
import {fileRoutes} from "./feature/auth/file/route/file.routes";



export const app = express()


app.use(cors());
app.use(express.json());
app.use(cookieParser());


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
