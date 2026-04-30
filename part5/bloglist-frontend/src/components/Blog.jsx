import { useState } from "react";
import Togglable from "./Togglable";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const [view, setView] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleLikeUpdate = async (event) => {
    try {
      event.preventDefault();
      const newObj = {
        ...blog,
        likes: likes + 1,
      };
      await blogService.updateBlog(blog.id, newObj);
      setLikes(likes+1);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div style={blogStyle}>
      {blog.title}
      {view ? (
        <div>
          {blog.url}
          <br />
          {likes} <button onClick={handleLikeUpdate}>like</button>
          <br />
          {blog.author}
        </div>
      ) : (
        ""
      )}
      <button onClick={() => setView(!view)}>{view ? "cancel" : "view"}</button>
    </div>
  );
};

export default Blog;
