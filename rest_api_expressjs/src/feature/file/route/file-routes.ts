import { Router} from "express";
import {container} from "../../../composition-root";
import {FileController} from "../api/file.controller";

import multer from "multer";
import multerS3 from "multer-s3";
import {s3Client} from "../../../utils/s3";
import {S3Client} from "@aws-sdk/client-s3";
import {checkAccessTokenMiddleware} from "../../../middlewares/check-accessToken-middleware";

export const fileRoutes = Router({});

const fileController = container.resolve(FileController)


// const s3Client = new S3Client({
//     region:'eu-north-1',
//     endpoint: process.env.AMAZON_CLOUD_URL,
//     credentials: {
//         secretAccessKey: process.env.AMAZON_CLOUD_SECRET_KEY,
//         accessKeyId: process.env.AMAZON_CLOUD_KEY_ID,
//     },
// });


// var upload = multer({
//     storage: multerS3({
//         s3: s3Client,
//         acl: 'public-read',
//         bucket: process.env.AMAZON_CLOUD_BUCKET_NAME,
//         key: function (req, file, cb) {
//             console.log(file);
//             cb(null, file.originalname); //use Date.now() for unique file keys
//         }
//     })
// });

const upload = multer()




fileRoutes.post('/upload',checkAccessTokenMiddleware,upload.single('file'),
    fileController.uploadFile.bind(fileController));

fileRoutes.get('/list',
    fileController.listFiles.bind(fileController));

fileRoutes.delete('/delete/:id',
    fileController.deleteFile.bind(fileController));

fileRoutes.get('/:id',
    fileController.getFile.bind(fileController));

fileRoutes.get('/download/:id',
    fileController.downloadFile.bind(fileController));

fileRoutes.put('/update/:id',
    fileController.updateFile.bind(fileController));





// authRoutes.get('/me', checkRefreshTokenMiddleware, authController.getCurrentUser.bind(authController))


//
// authRoutes.post('/logout', checkRefreshTokenMiddleware,
//     authController.logout.bind(authController));





