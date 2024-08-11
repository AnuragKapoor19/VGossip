import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import { IoEye } from 'react-icons/io5';
import { ChatState } from '../context/ChatProvider';
import { toast } from 'react-hot-toast';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchagain, setfetchagain, fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setgroupChatName] = useState();
    const [search, setsearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [renameLoading, setrenameLoading] = useState(false)
    const { selectedchat, setselectedchat, user } = ChatState()
    const handleRemove = async(user1) => {
        if(selectedchat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast.error("Only Admins can remove someone")
            return;
        }

        try {
            setloading(true)
            const config = await fetch("http://localhost:5000/api/chat/groupremove", {
              method: "PUT",
              headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({chatId:selectedchat._id,userId:user1._id})
            })
      
            const data = await config.json()
            user1._id === user._id ? setselectedchat(): setselectedchat(data)
            setfetchagain(!fetchagain)
            fetchMessages();
            setloading(false)
          } catch (error) {
            toast.error("Failed to Add the User", {
              position: "bottom-left"
            })
          }
    }

    const handleRename = async () => {
        if(!groupChatName){
            return
        }
        
        try {
            setrenameLoading(true)
            const config = await fetch("http://localhost:5000/api/chat/rename", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ chatId: selectedchat._id, chatName: groupChatName })
            })
    
            const data = await config.json()
            // console.log(data._id)
            setselectedchat(data)
            setfetchagain(!fetchagain)
            setrenameLoading(false)
        } catch (error) {
            console.log(error.message);
            toast.error("Some Error Occured!")
            setrenameLoading(false)
        }

        setgroupChatName("")
    }

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

      const handleAddUser = async(user1)=>{
        if(selectedchat.users.find((u)=> u._id === user1._id)){
            toast.error("User Already in Group!")
            return;
        }

        if(selectedchat.groupAdmin._id !== user._id){
            toast.error("Only Admin can add Someone!")
            return;
        }

        try {
            setloading(true)
            const config = await fetch("http://localhost:5000/api/chat/groupadd", {
              method: "PUT",
              headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({chatId:selectedchat._id,userId:user1._id})
            })
      
            const data = await config.json()
            // console.log(data);
            setselectedchat(data)
            setfetchagain(!fetchagain)
            setloading(false)
          } catch (error) {
            toast.error("Failed to Add the User", {
              position: "bottom-left"
            })
          }
      }


    return (
        <>
            <IconButton display={{ base: "flex" }} icon={<IoEye />} onClick={onOpen} />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work Sans"
                        display="flex"
                        justifyContent="center"
                    >{selectedchat.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display="flex" w="100%" flexWrap="wrap" pb={3}>
                            {selectedchat.users.map((u) => (
                                <UserBadgeItem key={u._id} user={u}
                                    handleFunction={() => handleRemove(u)} ></UserBadgeItem>
                            ))}
                        </Box>

                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                value={groupChatName}
                                onChange={(e) => setgroupChatName(e.target.value)}
                            />

                            <Button
                                variant="solid"
                                colorScheme='teal'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}>
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input placeholder='Add Users to Group' mb={1} onChange={(e) => handleSearch(e.target.value)} />
                        </FormControl>
                        {loading? (
                            <Spinner size="lg"></Spinner>
                        ):(
                            searchResult.map((user)=>(
                                <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={()=> handleAddUser(user)}
                                />
                            ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' onClick={()=> handleRemove(user)}>
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal