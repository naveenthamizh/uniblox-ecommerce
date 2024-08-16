import { useState } from "react";
import produce from "immer";
import { useNavigate } from "react-router-dom";
import { useUsersContext } from "../../Context/UserContext";
import styles from "./login.module.css";

type TUserInfo = {
  username: string;
  password: string;
};
const Login = () => {
  const navigate = useNavigate();

  const { userDetails, currentLoggedUser } = useUsersContext();

  const [userInfo, setUserInfo] = useState<TUserInfo>({
    username: "",
    password: "",
  });

  function updateUserInfo<T extends keyof TUserInfo>(
    key: T,
    value: TUserInfo[T]
  ) {
    setUserInfo(
      produce(userInfo, (draft) => {
        draft[key] = value;
      })
    );
  }

  // check user is loggedIn
  const handleUserLogin = () => {
    if (
      userDetails?.auth?.hasOwnProperty(userInfo.username) &&
      userDetails?.auth?.[userInfo.username].password === userInfo.password
    ) {
      currentLoggedUser?.(userInfo.username);
      alert("Logged In");
      navigate("/products");
    } else {
      alert("Username / password is invalid");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2 className={styles.h2}>Login</h2>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          handleUserLogin();
        }}
        className={styles.loginForm}
      >
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={userInfo.username}
            onChange={(e) => updateUserInfo("username", e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={userInfo.password}
            onChange={(e) => updateUserInfo("password", e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.loginButton}>
          Login
        </button>
      </form>
      <div className={styles.noAccount}>
        Don't have account?&nbsp;
        <span onClick={() => navigate("/signup")}>Register Now</span>
      </div>
    </div>
  );
};

export default Login;
