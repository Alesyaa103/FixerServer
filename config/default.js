require('dotenv').config();

module.exports= {
  databaseUrl: `mongodb+srv://first-server:${process.env.DATABASE_PASSWORD}@cluster0-ga2qm.mongodb.net/test?retryWrites=true&w=majority`,
  defaultUserPhoto: 'https://fixer-bucket.s3.eu-central-1.amazonaws.com/39462acbb13e85f3cd540c95604d53cd.png',
  crypto: {
    hash: {
      length: 100,
      iterations: 10,
    },
  },
  jwtSecret: process.env.JWT_SECRET,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: 'fixer-bucket',
    userPhoto: 'user-photos',
  },
};
