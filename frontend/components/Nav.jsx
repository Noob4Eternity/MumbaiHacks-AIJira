import React from "react";
import { UserAuth } from "../context/AuthContext";

const Nav = () => {
  const { user, logOut, googleSignIn } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between bg-black w-full p-4">
      <h1 className="text-center text-2xl font-bold twxt-white">KelaWFH</h1>
      {user?.displayName ? (
        <button onClick={handleSignOut}>Logout</button>
      ) : (
        <button onClick={googleSignIn}>Sign In</button>
      )}
    </div>
  );
};

export default Nav;
