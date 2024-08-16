import { useState } from "react";
import produce from "immer";
import { useNavigate } from "react-router-dom";
import { useUsersContext } from "../../Context/UserContext";
import { validateEmail } from "../../Common/utils";

import styles from "./signup.module.css";

type TUserInfo = {
  username: string;
  password: string;
};

export const SignUp = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<TUserInfo>({
    username: "",
    password: "",
  });

  const { updateAuthDetails } = useUsersContext();

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

  return (
    <div className={styles.signupContainer}>
      <h2 className={styles.h2}>Sign Up</h2>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          if (
            validateEmail(userInfo.username) &&
            userInfo.password?.length >= 8
          ) {
            updateAuthDetails?.(userInfo);
            navigate("/login");
          } else {
            alert(
              !validateEmail(userInfo.username)
                ? "Invalid Email"
                : "Password length should be greater than 7"
            );
          }
        }}
        className={styles.signupForm}
      >
        <div className="input-group">
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

        <button type="submit" className={styles.signupButton}>
          Sign Up
        </button>
      </form>
      <div className={styles.accountExist}>
        Already account exist?&nbsp;
        <span onClick={() => navigate("/login")}>Login</span>
      </div>
    </div>
  );
};
