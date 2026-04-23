import axios from 'axios'
const baseUrl = '/api/blogs'


let token = null ;

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}
const getMyBlogs=async ()=>{
  const config = {
    headers: { Authorization: token },
  }
  const res=await axios.get(`${baseUrl}/my-blogs`,config)
  return res.data;
}

export default { getAll,getMyBlogs,setToken}