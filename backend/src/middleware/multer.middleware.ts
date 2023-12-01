import multer from 'multer';
import express from 'express';

const upload = multer({ dest: 'uploads/' });

export type MulterFile = express.Request['file'];

// Expects a single video file as part of a Multipart-Form
// with the KEY of `video`
export const UploadVideo = upload.single('video');

// Expects a single video file as part of a Multipart-Form
// with the KEY of `audio`
export const UploadAudio = upload.single('audio');
