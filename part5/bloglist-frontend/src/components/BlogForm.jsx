const BlogForm=({title,author,url,handleTitleChange,handleAuthorChange,handleUrlChange,handleCreateBlog}) => {
    return (
      <form onSubmit={handleCreateBlog}>
        <label>
          title:
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
        </label>
        <br />
        <label>
          author:{" "}
          <input
            type="text"
            value={author}
            onChange={handleAuthorChange}
          />
        </label>
        <br />
        <label>
          url:{" "}
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
          />
        </label>
        <br />
        <button>Create</button>
      </form>
    );
}

export default BlogForm