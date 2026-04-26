import { useEffect, useState } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import "./index.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedInBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);

      blogService.getMyBlogs().then((blogs) => setBlogs(blogs));
    }
  }, []);

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

  const blogForm = () => {
    return (
      <form onSubmit={handleCreateBlog}>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <br />
        <label>
          author:{" "}
          <input
            type="text"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
          />
        </label>
        <br />
        <label>
          url:{" "}
          <input
            type="text"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
            }}
          />
        </label>
        <br />
        <button>Create</button>
      </form>
    );
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

  const handleCreateBlog = async () => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };

      const savedBlog = await blogService.createBlog(newBlog);

      setBlogs(blogs.concat(savedBlog));
      setTitle("");
      setAuthor("");
      setUrl("");
      setSuccessMsg(
        `A new blog ${savedBlog.title} by ${savedBlog.author} added`,
      );
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (error) {
      setErrorMessage("Failed to create blog. Check all fields.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  return (
    <div>
      {errorMessage && <h2 className="err-msg">{errorMessage}</h2>}

      {successMsg && <h2 className="succ-msg">{successMsg}</h2>}

      {!user ? <h2>Login</h2> : ""}
      {!user && loginForm()}

      {user && (
        <div>
          <h2>Blogs</h2>
          <div>
            <p>{user.name} Logged in</p>
            <button onClick={handleLogOut}>Log Out</button>
          </div>
          <h2>Create new</h2>
          {blogForm()}
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
