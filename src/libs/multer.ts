import { Request, Response, NextFunction } from "express";

import multer from 'multer'
import path from 'path'
import uuid from 'uuid/v4';
import mkdirp from 'mkdirp';

import * as jwt from "jsonwebtoken";
import config from "../config/config";

let UPLOAD_PATH = <string> process.env.UPLOAD_PATH;

const storage = multer.diskStorage({
	destination: function (req:any, file, cb) {
		let jwtPayload = <any>jwt.verify(req.headers.auth, config.jwtSecret);
		const { userId, username, pwd } = jwtPayload;
		cb(null, path.join(UPLOAD_PATH, pwd));
	},
	filename: function (req:any, file, cb) {
		// If you uploaded for example, the directory: myDir/myFile.txt,
		// file.originalname *would* be set to that (myDir/myFile.txt)
		// and myFile.txt would get saved to uploads/myDir
		// *provided that* uploads/myDir already exists.
		
		let jwtPayload = <any>jwt.verify(req.headers.auth, config.jwtSecret);
		const { userId, username, pwd } = jwtPayload;
		let p = path.join(UPLOAD_PATH, pwd, path.dirname(file.originalname));
		const made = mkdirp.sync(p);
		cb(null, uuid() + path.extname(file.originalname))
	}
});

export default multer({storage});
