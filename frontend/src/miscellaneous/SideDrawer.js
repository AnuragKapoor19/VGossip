import { Avatar, Box, Button, Hide, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoMdSearch } from "react-icons/io";
import { FaBell, FaAngleDown } from "react-icons/fa";
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import Badge from 'react-bootstrap/Badge';
import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { toast } from 'react-hot-toast';
import ChatLoading from '../components/ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import getSender from '../config/ChatLogics';

export default function SideDrawer() {
    const [search, setsearch] = useState("")
    const [searchResult, setsearchResult] = useState([])
    const [loading, setloading] = useState(false)
    const [loadingChat, setloadingChat] = useState()
    const { user, setselectedchat, chats, setchats, notification, setnotification } = ChatState()
    const navigate = useNavigate()
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/")
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleSearch = async () => {
        if (!search) {
            toast.error("Please Enter Something in Search", { position: "top-left" })
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
            setloading(false)
            setsearchResult(data)
        } catch (error) {
            toast.error("Failed to load the Search Results")
        }
    }

    const accessChat = async (userId) => {
        try {
            setloadingChat(true)
            const config = await fetch('http://localhost:5000/api/chat', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ userId })
            })

            const data = await config.json()

            if (!chats.find((c) => c._id === data._id)) {
                setchats([data, ...chats]);
            }
            setselectedchat(data);
            setloadingChat(false);
            onClose();
        } catch (error) {
            toast.error("Error Fetching the Chat", {
                position: "bottom-left"
            })
        }
    }

    return (
        <>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", width: "100%", padding: "5px 10px", borderWidth: "5px" }}>
                <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
                    <Button variant='ghost' onClick={onOpen} style={{ fontSize: "larger" }}>
                        <IoMdSearch />
                        <Hide below='md'>
                            <Text px="4">
                                Search User
                            </Text>
                        </Hide>
                    </Button>
                </Tooltip>

                <Text fontSize='2xl' fontFamily="Work Sans" color="black">
                    VGossip
                </Text>

                <div style={{ display: "flex", alignItems: "center" }}>
                    <Menu>
                        <MenuButton p={1} fontSize='2xl' style={{ display: "flex", alignItems: "center", position: "relative" }}>
                            <div className='notice' style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}>
                                <Badge
                                    pill
                                    style={{
                                        backgroundColor: "red",
                                        borderRadius: "50%",
                                        fontWeight: "bolder",
                                        fontSize: "small",
                                        height: "23px",
                                        width: "23px",
                                        display: notification.length === 0 ? "none" : "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        position: "absolute",
                                        top: "5px",
                                        right: "14px",
                                    }}>
                                    {notification.length}
                                </Badge>
                                <FaBell color={"black"} style={{ fontSize: "2.5rem" }} />
                            </div>
                        </MenuButton>
                        <MenuList color='black' pl={2}>
                            {!notification.length && "No New Messages"}
                            {notification.map(notif => (
                                <MenuItem key={notif._id} onClick={() => {
                                    setselectedchat(notif.chat)
                                    setnotification(notification.filter(n => n !== notif))
                                }}>
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`
                                    }
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<FaAngleDown />}>
                            <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic}></Avatar>
                        </MenuButton>
                        <MenuList color={"black"}>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box pb={2} style={{ display: "flex" }}>
                            <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setsearch(e.target.value)} />
                            <Button
                                onClick={handleSearch}
                            >Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult?.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml='auto' style={{ display: "flex" }}></Spinner>}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}
