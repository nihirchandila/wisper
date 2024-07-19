import {create} from "zustand"

const useConversation = create((set)=>({
    selectedConversation:null,
    setSelectedConversation: (selectedConversation)=>set({selectedConversation: selectedConversation}),
   
    messages: [],
	setMessages: (messages) => set({ messages }),

    //toggle conversation, chatarea and online section
    mobileStyle: {chat: true, conversation: false, online: false},
    setMobileStyle: (mobileStyle)=>set({mobileStyle})
}))
export default useConversation