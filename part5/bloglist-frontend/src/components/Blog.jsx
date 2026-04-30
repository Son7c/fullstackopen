import { useState } from "react";
import Togglable from "./Togglable";

const Blog = ({ blog }) => {
  const [view, setView] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  return (
    <div style={blogStyle}>
      {blog.title}
      {view ? (
        <div>
          {blog.url}
          <br />
          {blog.likes} <button>like</button>
          <br />
          {blog.author}
        </div>
      ) : (
        ""
      )}
      <button onClick={() => setView(!view)}>{view?"cancel":"view"}</button>
    </div>
  );
};

export default Blog;
