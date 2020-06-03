import React, { useState, useContext, useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const history = useHistory();
  let location = useLocation();
  if (location.pathname === "/signin" && state) {
    history.replace("/");
  }
  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "Invalid Email", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "Signin success",
            classes: "#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          placeholder="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => PostData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
        <h6>
          <Link to="/reset">Forgot Password ?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signin;
