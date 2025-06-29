import mongoose from 'mongoose'

type ConnectionObj = {
  isConnect?: number;
}

const connection: ConnectionObj = {}

const connectDb = async (): Promise<void> => {
  if(connection.isConnect === 1){
    console.log('Already connected to database');
    return
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('mongodbUri isnt available!');
  }

  try {
    const dbInstance = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnect = dbInstance.connection.readyState;

    console.log('DB Connected!');
  } catch (err) {
    console.error('dbConnection failed: ', err);
    process.exit(1);
  }
}

export default connectDb