import {getAuth, onAuthStateChanged} from "firebase/auth";

export const waitForAuth = () => {
    return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
                unsubscribe()
                resolve(user)
            })
    })
}