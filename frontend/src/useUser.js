import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config.js";

const useUser = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, function (user) {
      setUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);
  return { isLoading, user, userName: user?.displayName || "" };
};

export default useUser;
