import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import User, { IUser } from "../models/User";
import config from "../config/config";

export async function login(req: Request, res: Response) {
	let { username, password } = req.body;

	if (!(username && password)) {
		return res.status(400).send();
	}

	//Get user from database
	let user: any;
	try {
		user = await User.findOne({ "username": username });
	} catch (error) {
		return res.status(401).send();
	}

	if(user == null){
		return res.status(401).send();
	}
	//Check if encrypted password match
	if (!user.checkIfUnencryptedPasswordIsValid(password)) {
		return res.status(401).send();
	}

	//Sing JWT, valid for 1 hour
	const token = jwt.sign(
		{ userId: user.id, username: user.username, pwd:user.pwd },
		config.jwtSecret,
		{ expiresIn: "1h" }
	);

	//Send the jwt in the response
	return res.send(token);

};

export async function changePassword(req: Request, res: Response) {
	//Get ID from JWT
	const id = res.locals.jwtPayload.userId;

	//Get parameters from the body
	const { oldPassword, newPassword } = req.body;
	if (!(oldPassword && newPassword)) {
		return res.status(400).send();
	}

	//Get user from the database
	let user: any;
	try {
		user = await User.findOne({"_id":id});
	} catch (error) {
		return res.status(401).send();
	}

	//Check if old password matchs
	if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
		res.status(401).send();
	}

	//Validate de model (password lenght)
	user.password = newPassword;
	const errors = await validate(user);
	if (errors.length > 0) {
		return res.status(400).send(errors);
	}
	//Hash the new password and save
	user.hashPassword();
	user.save();

	return res.status(204).send();
};
