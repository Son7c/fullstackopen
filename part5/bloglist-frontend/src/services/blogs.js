import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};
const getMyBlogs = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.get(`${baseUrl}/my-blogs`, config);
  return res.data;
};

const createBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.post(`${baseUrl}`, newObject, config);
  return res.data;
};

const updateBlog = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return res.data;
};

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const res = await axios.delete(`${baseUrl}/${id}`, config);
  return res.data;
};

export default {
  getAll,
  getMyBlogs,
  setToken,
  createBlog,
  updateBlog,
  deleteBlog,
};
