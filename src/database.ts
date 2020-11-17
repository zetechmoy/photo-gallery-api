import { connect } from 'mongoose'

export async function startConnection() {
    const db = await connect('mongodb://mongo:27017/mean-gallery',{
        useNewUrlParser: true,
        useFindAndModify: false 
    });
    console.log('Database is connected');
}
