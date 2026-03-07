import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDxqnlPhulIU-ROLE-q74uTeu3g_ahQxRg",
  authDomain: "manyam-tourism.firebaseapp.com",
  projectId: "manyam-tourism",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
