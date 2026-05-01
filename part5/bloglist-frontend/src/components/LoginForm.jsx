const LoginForm = ({
  handleLogin,
  username,
  handleUserNameChange,
  password,
  handlePasswordChange,
}) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={handleUserNameChange}
          ></input>
        </label>
      </div>
      <div>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          ></input>
        </label>
      </div>
      <button>Submit</button>
    </form>
  )
}

export default LoginForm
