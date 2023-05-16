import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext";

const Navbar = () => {
  const {setUserInfo, userInfo} = useContext(UserContext)

  useEffect(() => {
    fetch("http://localhost:5000/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  const logOut = () => {
    fetch("http://localhost:5000/logout", {
      credentials: "include",
      method: 'POST'
    })
    setUserInfo(null)
  }

  const username = userInfo?.username

  return (
    <header>
      <Link to={"/"} className="logo">
        bLog.<span>In</span>
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logOut}>Logout</a>
          </>
        )}
        {!username && (
          <>
            <Link className="log-btn" to={"/login"}>Login</Link>
            <Link className="reg-btn" to={"/register"}>Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
