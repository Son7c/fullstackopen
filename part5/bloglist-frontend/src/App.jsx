import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);

      blogService.getMyBlogs().then((blogs) => setBlogs(blogs));
    }
  }, []);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const res = await loginService.login({ username, password });
      setUser(res);
      window.localStorage.setItem("loggedInBlogUser", JSON.stringify(res));
      blogService.setToken(res.token);

      const personalBlogs = await blogService.getMyBlogs();
      setBlogs(personalBlogs);

      setSuccessMsg(`${res.name} logged in successfully!`);

      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);

      setUsername("");
      setPassword("");
    } catch {
      setErrorMessage("Wrong Credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleLogOut = () => {
    window.localStorage.removeItem("loggedInBlogUser");
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async (blogObj) => {
    try {
      const savedBlog = await blogService.createBlog(blogObj);
      setBlogs(blogs.concat(savedBlog));

      setSuccessMsg(
        `A new blog "${savedBlog.title}" by ${savedBlog.author} added`,
      );

      setTimeout(() => {
        setSuccessMsg(null);
      }, 5000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      {errorMessage && <h2 className="err-msg">{errorMessage}</h2>}

      {successMsg && <h2 className="succ-msg">{successMsg}</h2>}

      {!user ? <h2>Login</h2> : ""}
      {!user && (
        <Togglable buttonLabel={"Login"}>
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            handleUserNameChange={handleUserNameChange}
            handlePasswordChange={handlePasswordChange}
            password={password}
          />
        </Togglable>
      )}

      {user && (
        <div>
          <h2>Blogs</h2>
          <div>
            <p>{user.name} Logged in</p>
            <button onClick={handleLogOut}>Log Out</button>
          </div>
          <Togglable buttonLabel={"Create"}>
            <h2>Create new</h2>
            <BlogForm handleCreateBlog={addBlog} />
          </Togglable>
          <br />
          <br />
          <br />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}

          <br></br>
        </div>
      )}
    </div>
  );
};

export default App;
