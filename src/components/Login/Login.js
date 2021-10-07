import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  FacebookAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

import { useContext, useState } from "react";
import firebaseConfig from "../../firebase.config";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";

const app = initializeApp(firebaseConfig);

function Login() {
  const gProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const ghProvider = new GithubAuthProvider();

  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    img: "",
  });
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [newUser, setNewUser] = useState(false);
  // Google authentication
  const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, gProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          img: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  };

  const handleGoogleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          img: "",
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Facebook authentication
  const handleFacebookSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  // Github authentication
  const handleGithubSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, ghProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          img: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  const handleGithubSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          img: "",
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Password authentication
  const handleFieldBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPassValid = e.target.value.length > 6;
      const isPassHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPassValid && isPassHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
    console.log(user);
  };

  const handleSubmitForm = (e) => {
    if (newUser && user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUser(user);

          updateUserName(user.name);
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }
    if (user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          setLoggedInUser(user);
          history.replace(from);
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }
    e.preventDefault();
  };
  const updateUserName = (name) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div style={{ textAlign: "center" }}>
      {/* Google authentication */}
      <div>
        <h2>Authentication With Google</h2>
        {user.isSignedIn ? (
          <button onClick={handleGoogleSignOut}>Google Sign out</button>
        ) : (
          <button onClick={handleGoogleSignIn}>Google Sign in</button>
        )}
        <h3>Name: {user.name}</h3>
        <h4>Email: {user.email}</h4>
        <img src={user.img} alt="" />
      </div>
      {/* Facebook authentication */}
      <div>
        <h2>Authentication With Facebook</h2>
        <button onClick={handleFacebookSignIn}>Facebook Login</button>
      </div>
      {/* Github authentication*/}
      <div>
        <h2>Authentication With Github</h2>
        {user.isSignedIn ? (
          <button onClick={handleGithubSignOut}>Github Sign out</button>
        ) : (
          <button onClick={handleGithubSignIn}>Github Sign in</button>
        )}
      </div>
      {/* Gmail, password authentication */}
      <div>
        <h2>Authentication With Password</h2>
        <input
          onClick={() => {
            setNewUser(!newUser);
          }}
          type="checkbox"
          id="newUser"
        />
        <label htmlFor="newUser">New User</label>
        <form>
          {newUser && (
            <input
              onBlur={handleFieldBlur}
              type="text"
              name="name"
              placeholder="Enter Your Name"
              required
            />
          )}
          <br />
          <input
            onBlur={handleFieldBlur}
            type="text"
            name="email"
            placeholder="Enter Your Email"
            required
          />
          <br />
          <input
            onBlur={handleFieldBlur}
            type="password"
            name="password"
            placeholder="Enter Your Password"
            required
          />
          <br />
          {newUser ? (
            <input onClick={handleSubmitForm} type="submit" value="Sign up" />
          ) : (
            <input onClick={handleSubmitForm} type="submit" value="Sign in" />
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
