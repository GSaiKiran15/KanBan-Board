import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config.js";

export const waitForAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};
