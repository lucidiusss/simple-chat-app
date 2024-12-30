import { FcGoogle } from "react-icons/fc";
import { Button } from "./ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, GoogleProvider } from "@/firebase-config";
import { CookieSetOptions } from "universal-cookie";

interface AuthProps {
  isAuth: boolean;
  setIsAuth: (isAuth: boolean) => void;
  setCookie: (
    name: string,
    value: any,
    options?: CookieSetOptions | undefined
  ) => void;
  removeCookie: (name: string, options?: CookieSetOptions) => void;
}

const Auth = ({ setIsAuth, setCookie, removeCookie, isAuth }: AuthProps) => {
  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, GoogleProvider);
      setCookie("auth-token", result.user.refreshToken);
      setIsAuth(true);
    } catch (err) {
      console.error(err);
    }
  };
  const signOut = async () => {
    removeCookie("auth-token");
    setIsAuth(false);
  };

  return (
    <div className="flex flex-col items-center">
      {!isAuth ? (
        <Button onClick={signInGoogle} className="flex items-center">
          Sign in with Google to continue
          <FcGoogle />
        </Button>
      ) : (
        <Button onClick={signOut}>Sign Out</Button>
      )}
    </div>
  );
};

export default Auth;
