require('dotenv').config();

module.exports = {
  SPRING_BOOT_API_URL: process.env.SPRING_BOOT_API_URL || 'http://localhost:8080',
  PORT: process.env.PORT || 3000,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
};