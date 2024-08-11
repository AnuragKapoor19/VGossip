import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { ChatState } from '../context/ChatProvider';
import UserListItem from '../UserAvatar/UserListItem';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

export default function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUsers, setselectedUsers] = useState([]);
  const [search, setsearch] = useState("");
  const [searchResult, setsearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const { user, chats, setchats } = ChatState();

  const handleSearch = async (query) => {
    setsearch(query)
    if (!query) {
      return;
    }
    try {
      setloading(true)
      const config = await fetch(`http://localhost:5000/api/user?search=${search}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })

      const data = await config.json()
      // console.log(data);
      setloading(false)
      setsearchResult(data)
    } catch (error) {
      toast.error("Failed to Load the Search Results", {
        position: "bottom-left"
      })
    }
  }

  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
      toast.error("Please fill all the fields",{
        position:"top-center"
      })
      return;
    }

    try {
      const config = await fetch("http://localhost:5000/api/chat/group",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({name:groupChatName,users:JSON.stringify(selectedUsers.map((u)=> u._id))})
      })

      const data = await config.json();
      setchats([data,...chats]);
      onClose();
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error("Failed to create the chat")
    }
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast("User Already Added", {
        position: "top-center"
      })
      return;
    }

    setselectedUsers([...selectedUsers, userToAdd])
  }

  const handleDelete = (userToDelete) => {
    setselectedUsers(selectedUsers.filter((sel)=> sel._id !== userToDelete._id))
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work Sans"
            justifyContent="center"
            display="flex"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input placeholder='Chat Name' mb={3} onChange={(e) => setgroupChatName(e.target.value)} />
            </FormControl>

            <FormControl>
              <Input placeholder='Add Users eg: John, Piyush, Jane' mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>

            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem key={u._id} user={u}
                  handleFunction={() => handleDelete(u)} ></UserBadgeItem>
              ))}
            </Box>

            {loading ? (
              <div>loading</div>
            ) : (
              searchResult.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}></UserListItem>
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
