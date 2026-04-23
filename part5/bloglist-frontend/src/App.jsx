import { useState} from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
  const userBlogs = user
    ? blogs.filter((blog) => blog.user._id === user.id)
    : [];
  return (
    <div>
      <h1>{errorMessage}</h1>
      {!user?<h2>Login</h2>:''}
      {!user && loginForm()}
      
      {user &&
      <div>
        <h2>Blogs</h2>
        <p>{user.name} Logged in</p>
        {userBlogs.map((blog) => <Blog key={blog.id} blog={blog} />)}
      </div>
      }
    </div>
  );
};

export default App;
