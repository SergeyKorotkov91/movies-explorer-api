const { PORT, MONGODB_URI } = process.env;

const config = {
  port: PORT || 3000,
  mongodbURI: MONGODB_URI || 'mongodb://127.0.0.1:27017/bitfilmsdb',
};

module.exports = config;