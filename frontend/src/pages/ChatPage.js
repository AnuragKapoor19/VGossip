import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../miscellaneous/SideDrawer'
import MyChats from '../miscellaneous/MyChats'
import ChatBox from '../miscellaneous/ChatBox'

export default function ChatPage() {
  const { user } = ChatState()

  console.log({user});
  
  const [fetchagain, setfetchagain] =  useState()

  return (
    <div style={{ width: "100%", color: "white" }}>
      {user && <SideDrawer />}
      <Box style={{ display: "flex" }} justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
        {user && <MyChats fetchagain={fetchagain}/>}
        {user && <ChatBox fetchagain={fetchagain} setfetchagain={setfetchagain}/>}
      </Box>
    </div>
  )
}
