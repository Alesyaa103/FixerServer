module.exports = {
  databaseUrl: 'mongodb+srv://first-server:alesya8098@cluster0-ga2qm.mongodb.net/test?retryWrites=true&w=majority',
  defaultUserPhoto: 'https://fixer-bucket.s3.eu-central-1.amazonaws.com/39462acbb13e85f3cd540c95604d53cd.png',

  crypto: {
    hash: {
      length: 100,
      iterations: 10,
    },
  },
  jwtSecret: 'sup3kjdskjb12356',
  aws: {
    accessKeyId: 'AKIAW45DW5LFTU6XHHI7',
    secretAccessKey: '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',
    bucketName: 'fixer-bucket',
    userPhoto: 'user-photos',
  },
};
