// src/hooks/useUser.js
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseClient"; // <-- use the shared instance

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);              // null if signed out
      setIsLoading(false);     // Firebase finished hydrating
    });
    return unsubscribe;        // cleanup to avoid leaks
  }, []);

  return { isLoading, user };
};

export default useUser;