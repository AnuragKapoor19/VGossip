import { Box } from '@chakra-ui/react'
import React from 'react'
import { IoMdClose } from "react-icons/io";

export default function UserBadgeItem({ user, handleFunction }) {
    return (
        <Box
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant='solid'
            fontSize={12}
            backgroundColor="purple"
            color="white"
            cursor="pointer"
            onClick={handleFunction}
            display="flex"
            alignItems="center"
        >
            {user.name}
            <IoMdClose style={{paddingLeft:"4px",fontSize:"larger"}}/>
        </Box>
    )
}
