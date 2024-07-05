import { Router} from "express";
import {container} from "../../../composition-root";
import {FileController} from "../api/file.controller";

import multer from "multer";

import {checkAccessTokenMiddleware} from "../../../middlewares/check-accessToken-middleware";

export const fileRoutes = Router({});

const fileController = container.resolve(FileController)



const upload = multer()




fileRoutes.post('/upload',checkAccessTokenMiddleware,upload.single('file'),
    fileController.uploadFile.bind(fileController));

fileRoutes.get('/list',
    fileController.listFiles.bind(fileController));

// fileRoutes.delete('/delete/:id',
//     fileController.deleteFile.bind(fileController));
//
fileRoutes.get('/:id',
    fileController.getFile.bind(fileController));

fileRoutes.get('/download/:id',
    fileController.downloadFile.bind(fileController));


fileRoutes.put('/update/:id',checkAccessTokenMiddleware,upload.single('file'),
    fileController.updateFile.bind(fileController));





// authRoutes.get('/me', checkRefreshTokenMiddleware, authController.getCurrentUser.bind(authController))


//
// authRoutes.post('/logout', checkRefreshTokenMiddleware,
//     authController.logout.bind(authController));





