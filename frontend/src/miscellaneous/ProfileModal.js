import {
    IconButton,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Image,
    Text,
} from '@chakra-ui/react'
import React from 'react'
import { IoEye } from "react-icons/io5";

export default function ProfileModal({ user, children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (<IconButton icon={<IoEye />} onClick={onOpen}></IconButton>)}

            <Modal size='lg' isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent height='410px'>
                    <ModalHeader style={{display:"flex", fontSize:"40px", fontFamily:"Work Sans", justifyContent:"center"}}>{user.name}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between"}}>
                        <Image 
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                        ></Image>

                        <Text fontFamily="Work Sans" fontSize={{base: "28px", md:"30px"}} >Email: {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
