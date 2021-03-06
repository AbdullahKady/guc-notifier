import axios from 'axios';
import { CREATED, UNAUTHORIZED } from 'http-status';
import { COURSEWORK_API_URI, TRANSCRIPT_API_URI } from './config';
import User from './models/user';

const getCourses = async (username, password) => {
  try {
    const { data } = await axios.post(COURSEWORK_API_URI, { username, password }, {});
    return data.courses;
  } catch ({ response }) {
    const error = new Error();
    const { status } = response;
    if (status === UNAUTHORIZED) {
      error.message = 'Invalid credentials';
    }
    error.status = status;
    throw error;
  }
};

const getLatestTranscriptEntry = async (username, password) => {
  try {
    const { data } = await axios.post(TRANSCRIPT_API_URI, { username, password }, {});
    return data.transcript.semesters.pop(); // Get the latest entry only
  } catch ({ response }) {
    const error = new Error();
    const { status } = response;
    if (status === UNAUTHORIZED) {
      error.message = 'Invalid credentials';
    }
    error.status = status;
    throw error;
  }
};

const subscribeUser = async (req, res, next) => {
  const { username, password, email } = req.body;

  let coursework;
  let transcript;
  try {
    [coursework, transcript] = await Promise.all([
      getCourses(username, password),
      getLatestTranscriptEntry(username, password),
    ]);
  } catch (err) {
    return next(err);
  }

  const userDocument = {
    username,
    password,
    email,
    latestGrades: {
      coursework,
      transcript,
    },
    nextCheckTimestamp: new Date(),
  };

  try {
    await User.findOneAndUpdate({ username }, userDocument, { upsert: true });
    return res.status(CREATED).json({ message: 'Subscribed successfully' });
  } catch (err) {
    return next(err);
  }
};

export default {
  subscribeUser,
};
