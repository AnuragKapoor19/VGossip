import { createContext, useContext, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setuser] = useState();
    const [selectedchat, setselectedchat] = useState();
    const [chats, setchats] = useState([]);
    const [notification, setnotification] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"))
        setuser(userInfo)

        if(!userInfo){
            navigate("/")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate])

    return (
        <ChatContext.Provider value={{ user, setuser, selectedchat, setselectedchat, chats, setchats, notification, setnotification }}>
            {children}
        </ChatContext.Provider>
    )
};

export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;