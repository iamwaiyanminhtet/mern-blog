import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { Button } from "flowbite-react";
import { app } from "../firebase/firebase.js"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { signInStart, signInSuccess, signInFailure } from "../redux/user/user.slice.js"

const GoogleLoginButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = getAuth(app);
  auth.useDeviceLanguage();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" })

    try {
      dispatch(signInStart);

      const googleUserData = await signInWithPopup(auth, provider);

      const res = await fetch('/api/auth/google-login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: googleUserData.user.displayName,
          email: googleUserData.user.email.toLowerCase(),
          googlePfp: googleUserData.user.photoURL
        })
      })

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message))
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <Button className="w-full flex items-center justify-center font-semibold" outline gradientDuoTone="greenToBlue" onClick={() => handleGoogleLogin()} >
      <FaGoogle /> <span className="ms-3">Continue with Google</span>
    </Button>
  )
}

export default GoogleLoginButton