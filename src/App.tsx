import { useCookies } from "react-cookie";
import Auth from "./components/Auth";
import Chat from "./components/Chat";
import { useState } from "react";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies<string>(["auth-token"]);
  const [isAuth, setIsAuth] = useState<boolean>(cookies["auth-token"]);

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      {isAuth && <Chat />}
      <Auth
        setIsAuth={setIsAuth}
        setCookie={setCookie}
        removeCookie={removeCookie}
        isAuth={isAuth}
      />
    </main>
  );
}

export default App;
