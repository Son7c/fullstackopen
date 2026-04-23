import { useEffect, useState} from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(()=>{
    const loggedUserJSON=window.localStorage.getItem('loggedInBlogUser');
    if(loggedUserJSON){
      const user=JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);

      blogService.getMyBlogs().then(blogs=>setBlogs(blogs));
    }
  },[])

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            ></input>
          </label>
        </div>
        <div>
          <label>
            Password
            <input
            type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            ></input>
          </label>
        </div>
        <button>Submit</button>
      </form>
    );
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await loginService.login({ username, password });
      setUser(res);
      window.localStorage.setItem('loggedInBlogUser',JSON.stringify(res))
      blogService.setToken(res.token);

      const personalBlogs = await blogService.getMyBlogs();
      setBlogs(personalBlogs);

      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogOut=()=>{
    window.localStorage.removeItem('loggedInBlogUser');
    setUser(null);
    blogService.setToken(null);
  }
  return (
    <div>
      <h1>{errorMessage}</h1>
      {!user?<h2>Login</h2>:''}
      {!user && loginForm()}
      
      {user &&
      <div>
        <h2>Blogs</h2>
        <div>
          <p>{user.name} Logged in</p>
          <button onClick={handleLogOut}>Log Out</button>
        </div>
        {blogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
      </div>
      }
    </div>
  );
};

export default App;
