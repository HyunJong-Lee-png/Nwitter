import { FirebaseError } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../../firebase";
import { Img, SocialLogin } from "../Styled-components/Sign-form";
import { useNavigate } from "react-router-dom";

export default function GoogleBtn() {
  const navigate = useNavigate();

  const handleSocial = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e.message);
      }
    }
  };

  return (
    <SocialLogin onClick={() => handleSocial()}>Login with Google<Img src="/image.png" /></SocialLogin>
  );
}