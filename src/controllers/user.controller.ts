import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import User, { IUser } from "../models/User";

export async function listAll(req: Request, res: Response) {
	//Get users from database
	const users = await User.find({}).select({ id: 1, username: 1, role:1, pwd:1 });

	//Send the users object
	res.send(users);
};

export async function getOneById(req: Request, res: Response) {
	//Get the ID from the url
	const id: string = req.params.id;
	//Get the user from database
	const user = await User.findOne({"_id":id}).select({ id: 1, username: 1, role:1, pwd:1 });
	if(user == null){
		return res.status(404).send("User not found");
	}

	return res.send(user);
};

export async function newUser(req: Request, res: Response) {
	//Get parameters from the body
	let { username, password, role, pwd } = req.body;
	let user = new User();
	user.username = username;
	user.password = password;
	user.role = role;
	user.pwd = pwd;

	//Validade if the parameters are ok
	const errors = await validate(user);
	if (errors.length > 0) {
		res.status(400).send(errors);
		return;
	}

	//Hash the password, to securely store on DB
	user.hashPassword();

	//Try to save. If fails, the username is already in use
	try {
		await user.save();
	} catch (e) {
		res.status(409).send("username already in use");
		return;
	}

	//If all ok, send 201 response
	res.status(201).send("User created");
};

export async function editUser(req: Request, res: Response) {
	//Get the ID from the url
	const id = req.params.id;

	//Get values from the body
	const { username, role, pwd } = req.body;

	//Try to find user on database
	let user: any = null
	user = await User.findOne({"_id":id});

	if(user != null){
		user.username = username;
		user.role = role;
		user.pwd = pwd;

		//Validate the new values on model
		const errors = await validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}

		//Try to safe, if fails, that means username already in use
		try {
			await user.save(user);
		} catch (e) {
			return res.status(409).send("username already in use");
		}
		//After all send a 204 (no content, but accepted) response
		return res.status(204).send();

	}else{
		return res.status(404).send("User not found");

	}
};

export async function deleteUser(req: Request, res: Response) {
	//Get the ID from the url
	const id = req.params.id;

	let user: any = null;
	user = await User.findOne({"_id":id});
	if(user == null){
		return res.status(404).send("User not found");
	}
	user.delete();

	//After all send a 204 (no content, but accepted) response
	return res.status(204).send();
};
