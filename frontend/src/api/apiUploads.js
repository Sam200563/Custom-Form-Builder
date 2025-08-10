import axios from 'axios';

const APIUpload = axios.create({
  baseURL: 'http://localhost:5000/api/uploads',
});

export default APIUpload;
