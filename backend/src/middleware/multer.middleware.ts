import multer from 'multer';
import express from 'express';

const upload = multer({ dest: 'uploads/' });

export type MulterFile = express.Request['file'];
export const UploadVideo = upload.single('video');
