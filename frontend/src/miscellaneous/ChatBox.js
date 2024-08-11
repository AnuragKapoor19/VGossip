import React from 'react'
import { ChatState } from '../context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from '../components/SingleChat'


export default function ChatBox({ fetchagain, setfetchagain}) {
 const {selectedchat} = ChatState()

  return (
    <Box 
    display={{ base: selectedchat ? "flex" : "none", md: "flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    color="black"
    w={{ base: "100%", md: "68%"}}
    borderRadius="lg"
    borderWidth="1px"
    >
      <SingleChat fetchagain={fetchagain} setfetchagain={setfetchagain}/>
    </Box>
  )
}
