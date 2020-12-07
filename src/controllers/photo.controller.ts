import { Request, Response } from 'express'
import fs from 'fs-extra';
import path from 'path'

// Models
import Photo, { IPhoto } from '../models/Photo';

export async function getPhotos(req: Request, res: Response): Promise<Response> {
	const uid = res.locals.jwtPayload.userId;
	const photos = await Photo.find({"publisherId":uid});
	return res.json(photos);
};

export async function createPhoto(req: Request, res: Response): Promise<Response> {
	const { title, description } = req.body;
	const uid = res.locals.jwtPayload.userId;
	const newPhoto = { title, description, imagePath: req.file.path, publisherId:uid };
	const photo = new Photo(newPhoto);
	await photo.save();
	return res.json(photo);
};

export async function getPhoto(req: Request, res: Response): Promise<Response> {
	const { id } = req.params;
	const uid = res.locals.jwtPayload.userId;
	const photo = await Photo.findById({"_id":id, "publisherId":uid});
	return res.json(photo);
}

export async function deletePhoto(req: Request, res: Response): Promise<Response> {
	const { id } = req.params;
	const photo = await Photo.findByIdAndRemove({"_id":id}) as IPhoto;
	if (photo) {
		await fs.unlink(path.resolve(photo.imagePath));
	}
	return res.send(204);
};

export async function updatePhoto(req: Request, res: Response): Promise<Response> {
	const { id } = req.params;
	const { title, description } = req.body;
	const uid = res.locals.jwtPayload.userId;
	const updatedPhoto = await Photo.findByIdAndUpdate({"_id":id, "publisherId":uid}, {
		title,
		description
	});
	return res.json(updatedPhoto);
}
