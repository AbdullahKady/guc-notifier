/*
  This module just initializes the environment variables.
  To work with es6 module, check: https://github.com/motdotla/dotenv/issues/133#issuecomment-255298822
*/
import dotenv from 'dotenv';

dotenv.config();

const {
  PORT, MONGO_URI, COURSEWORK_API_URI, ENCRYPTION_SECRET, TRANSCRIPT_API_URI,
} = process.env;
const mongoConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

export {
  PORT,
  MONGO_URI,
  mongoConnectionOptions,
  ENCRYPTION_SECRET,
  COURSEWORK_API_URI,
  TRANSCRIPT_API_URI,
};
