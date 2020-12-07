import { Schema, model, Document } from 'mongoose'

const schema = new Schema({
    title: String,
    description: String,
    imagePath: String,
		publisherId: String
});

export interface IPhoto extends Document {
    title: string;
    description: string;
    imagePath: string;
		publisherId: string;
}

export default model<IPhoto>('Photo', schema);
