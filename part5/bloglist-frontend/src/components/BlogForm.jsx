import { useState } from "react";

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    handleCreateBlog({
      title,
      author,
      url,
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <label>
        title:
        <input
          type="text"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
      </label>
      <br />
      <label>
        author:{" "}
        <input
          type="text"
          value={author}
          onChange={(event) => {
            setAuthor(event.target.value);
          }}
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

export default BlogForm;
