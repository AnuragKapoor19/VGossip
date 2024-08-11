import { Box, Button, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { ChatState } from '../context/ChatProvider';
import { IoIosAddCircle } from "react-icons/io";
import ChatLoading from '../components/ChatLoading';
import getSender from '../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

export default function MyChats({fetchagain}) {
  const [loggeduser, setloggeduser] = useState();
  const { user, selectedchat, setselectedchat, chats, setchats } = ChatState();

  const fetchChats = async () => {
    try {
      const config = await fetch("http://localhost:5000/api/chat", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      const data = await config.json()
      // console.log(data)
      setchats(data)
    } catch (error) {
      toast.error("Failed to Load the Chats", {
        position: "bottom-left"
      })
    }
  }

  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
    // eslint-disable-next-line
  }, [fetchagain])

  return (
    <Box
      display= {{ base: selectedchat ? "none" : "flex", md: "flex" } }
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: "100%", md: "31%" }}
      borderRadius='lg'
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Sans"
        style={{ display: "flex" }}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        color="black"
      >
        My Chats
        <GroupChatModal>
          <Button
            style={{ display: "flex" }}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<IoIosAddCircle style={{ fontSize: "larger" }} />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        style={{ display: "flex" }}
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        // h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setselectedchat(chat)}
                cursor="pointer"
                bg={selectedchat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedchat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggeduser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}
