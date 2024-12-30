import { useEffect, useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button, buttonVariants } from "./ui/button";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/firebase-config";

interface ChatProps {
  id: string;
  userName: string;
  userPicture: string;
  createdAt: {
    nanoseconds: BigInt;
    seconds: BigInt;
  };
  text: string;
}

const Chat = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<ChatProps[]>([]);

  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMessages = query(messagesRef, orderBy("createdAt"));
    const unsubcribe = onSnapshot(queryMessages, (snapshot) => {
      let messages: any = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubcribe();
  });

  const handleSend = async () => {
    if (newMessage === "") return;
    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      userName: auth.currentUser?.displayName,
      userPicture: auth.currentUser?.photoURL,
    });
    setNewMessage("");
  };

  return (
    <>
      <div className="border-2 border-black rounded-xl p-4 w-1/2 h-1/2 mb-10">
        <div className="overflow-y-scroll h-full flex flex-col gap-5">
          {messages.map((m) => (
            <div className="flex flex-row gap-2 items-center">
              <img
                src={m.userPicture}
                alt="user image"
                className="rounded-full h-8 w-8"
              />
              <div className="flex flex-col">
                <h1 className="text-[#212121] text-md font-semibold">
                  {m.userName}
                </h1>
                <p className="text-xs">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 flex flex-col gap-5 mb-16">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="type your message here..."
          className="transition w-full h-16"
        />
        <Button
          onClick={handleSend}
          className={buttonVariants({
            size: "sm",
            variant: "outline",
            className: "text-black w-fit place-self-end",
          })}
        >
          Send
        </Button>
      </div>
    </>
  );
};
export default Chat;
