import { useEffect, useContext } from "react";

import useConversation from "../zustand/useConversation.js";
import SocketContext from "../context/SocketContext.js";
import sounds from "../assets/message-ringtone.mp3"

const useListenMessages = () => {
	const { socket } = useContext(SocketContext);
	const { messages, setMessages } = useConversation();

	useEffect(() => {
		socket?.on("newMessage", (newMessage) => {
			setMessages([...messages, newMessage]);
			const sound = new Audio(sounds);
			sound.play();
		});

		return () => socket?.off("newMessage");
	}, [socket, setMessages, messages]);

};
export default useListenMessages;