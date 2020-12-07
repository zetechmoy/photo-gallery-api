import * as bcrypt from "bcryptjs";
import { Schema, model, Document } from 'mongoose'

const schema = new Schema({
	username: { type:String, unique: true },
	password: String,
	pwd: String,
	role: String,
	createdAt: Date,
	updatedAt: Date
});

schema.methods.checkIfUnencryptedPasswordIsValid = function(unencryptedPassword: string) {
	return bcrypt.compareSync(unencryptedPassword, this.password);
}

schema.methods.hashPassword = function() {
	this.password = bcrypt.hashSync(this.password, 8);
}

export interface IUser extends Document {
	username: String,
	password: String,
	pwd: String,
	role: String,
	createdAt: Date,
	updatedAt: Date,

	hashPassword(): void,
	checkIfUnencryptedPasswordIsValid(unencryptedPassword: string): string
};

export default model<IUser>('User', schema);
