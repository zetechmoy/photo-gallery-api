import { connect } from 'mongoose';
import User, { IUser } from "./models/User";

const MONGO_URI = process.env.MONGO_URI;
const ENV = process.env.ENV;

let addAdminUser = async () => {

	let admin_user: any = null
	admin_user = await User.findOne({"role":"ADMIN"});

	if(admin_user == null){
		let user = new User();

		let username = process.env.ADMIN_USERNAME;
		if(username == undefined){username = "admin";}
		let password = process.env.ADMIN_PASSWORD;
		if(password == undefined){password = "admin";}

		user.username = username;
		user.password = password;
		user.role = "ADMIN";
		user.pwd = "./"+user.username;

		//Hash the password, to securely store on DB
		user.hashPassword();

		//Try to save. If fails, the username is already in use
		await user.save();	
	}


}

export async function startConnection() {
	const db = await connect(MONGO_URI+'/gphotos',{
		useNewUrlParser: true,
		useFindAndModify: false
	});
	console.log('Database is connected');
	addAdminUser();
	console.log('Admin user added');
}
