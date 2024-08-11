import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box, FormControl, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { IoMdArrowBack } from "react-icons/io";
import getSender, { getSenderFull } from '../config/ChatLogics';
import ProfileModal from "../miscellaneous/ProfileModal"
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import toast from 'react-hot-toast';
import Lottie from "react-lottie";
import "./style.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import animationData from "../animations/Typing.json"
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

export default function SingleChat({ fetchagain, setfetchagain }) {

    const [messages, setmessages] = useState([])
    const [loading, setloading] = useState(false)
    const [newMessage, setnewMessage] = useState()
    const { user, selectedchat, setselectedchat, notification, setnotification } = ChatState();
    const [socketConnected, setsocketConnected] = useState(false)
    const [typing, settyping] = useState(false)
    const [isTyping, setisTyping] = useState(false)
    const defaultOptions = {
        loop: true,
        autoPlay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user)
        socket.on("connected", () => {
            setsocketConnected(true);
        })
        socket.on("typing", () => setisTyping(true));
        socket.on("stop typing", () => setisTyping(false));

        // eslint-disable-next-line
    }, [])

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedchat._id)
            try {
                setnewMessage("");
                const config = await fetch("http://localhost:5000/api/message", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({
                        content: newMessage,
                        chatId: selectedchat._id
                    })
                })

                const data = await config.json()
                console.log(data)

                socket.emit('new message', data)
                setmessages([...messages, data])
            } catch (error) {
                toast.error("Failed to send the message")
            }
        }
    }

    const fetchMessages = async () => {
        if (!selectedchat) return;
        try {
            setloading(true)
            const config = await fetch(`http://localhost:5000/api/message/${selectedchat._id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            })
            const data = await config.json();
            console.log(data)
            setmessages(data);
            setloading(false);
            socket.emit("join chat", selectedchat._id);

        } catch (error) {
            toast.error("Failed to Load the Messages")
        }
    }

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedchat;
        // eslint-disable-next-line
    }, [selectedchat])

    useEffect(() => {
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if(!notification.includes(newMessageReceived)){
                    setnotification([newMessageReceived,...notification]);
                    setfetchagain(!fetchagain);
                }
            } else {
                setmessages([...messages, newMessageReceived]);
            }
        })
    })

    const typingHandler = (e) => {
        setnewMessage(e.target.value)

        //Typing Indicator Logic
        if (!socketConnected) return;

        if (!typing) {
            settyping(true)
            socket.emit("typing", selectedchat._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000;

        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedchat._id)
                settyping(false)
            }
        }, timerLength);
    }

    return (
        <>
            {
                selectedchat ? (
                    <>
                        <Text
                            fontSize={{ base: "28px", md: "30px" }}
                            pb={3}
                            px={2}
                            w="100%"
                            fontFamily="Work Sans"
                            display="flex"
                            justifyContent={{ base: "space-between" }}
                            alignItems="center"
                        >
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                icon={<IoMdArrowBack />}
                                onClick={() => setselectedchat("")}
                            />

                            {!selectedchat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedchat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedchat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedchat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchagain={fetchagain}
                                        setfetchagain={setfetchagain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )}
                        </Text>
                        <Box
                            display="flex"
                            flexDir="column"
                            justifyContent="flex-end"
                            p={3}
                            bg="#E8E8E8"
                            w="100%"
                            h="100%"
                            borderRadius="lg"
                            overflowY="hidden"
                        >
                            {loading ? (
                                <Spinner
                                    size='xl'
                                    w={20}
                                    h={20}
                                    alignSelf="center"
                                    margin="auto"
                                />
                            ) : <div className='messages'>
                                <ScrollableChat messages={messages} />
                            </div>}

                            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                                {isTyping ?
                                    <div>
                                        <Lottie
                                            width={70}
                                            options={defaultOptions}
                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                        />
                                    </div>
                                    : <></>}

                                <Input
                                    variant="filled"
                                    bg="#E0E0E0"
                                    placeholder='Enter a message...'
                                    onChange={typingHandler}
                                    value={newMessage}
                                />
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                        <Text fontSize="3xl" pb={3} fontFamily="Work Sans">
                            Click on a user to start chatting
                        </Text>
                    </Box>
                )
            }
        </>
    )
}
