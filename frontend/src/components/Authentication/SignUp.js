import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom"

function SignUp() {
    const [credentials, setcredentials] = useState({ name: "", email: "", password: "", confirmpassword: "", gender: "Male" })
    const handleChange = (e) => {
        setcredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    const navigate = useNavigate();
    const [show, setshow] = useState(false)
    const handleClick = (e) => {
        setshow(!show)
    }

    const [showc, setshowc] = useState(false)
    const handleClick2 = (e) => {
        setshowc(!showc)
    }
    const boypic = `https://avatar.iran.liara.run/public/boy?username=${credentials.name}`;
    const girlpic = `https://avatar.iran.liara.run/public/girl?username=${credentials.name}`;

    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:5000/api/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password, gender: credentials.gender, pic: (credentials.gender === "Male" ? boypic : girlpic)})
            })
            const data = await response.json()
            if (data.success) {
                // console.log(data)
                localStorage.setItem("userInfo", JSON.stringify(data))
                toast.success("Account Created Successfully")
                navigate("/chats")
            }

            if(!data.success){
                toast.error(`Enter Valid Credentials : ${data.errors[0].msg}`)
                console.log(data.errors[0].msg)
            }
        } catch (error) {
            console.log("Error in signup: ", error.message)
        }
    }
    return (
        <VStack spacing='5px' color='black'>
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Your Name" name="name" value={credentials.name} onChange={handleChange}></Input>
            </FormControl>
            <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Enter Your Email" name="email" value={credentials.email} onChange={handleChange}></Input>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                    <Input type={show ? "text" : "password"} placeholder="Password" name="password" value={credentials.password} onChange={handleChange}></Input>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="confirm-password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                    <Input type={showc ? "text" : "password"} placeholder="Confirm Password" name="confirmpassword" value={credentials.confirmpassword} onChange={handleChange}></Input>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick2}>
                            {showc ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic" isRequired>
                <FormLabel>Gender</FormLabel>
                <select name="gender" value={credentials.gender} onChange={handleChange}>
                    <option>Male</option>
                    <option>Female</option>
                </select>
            </FormControl>
            <Button colorScheme="blue" width='100%' style={{ marginTop: 15 }} onClick={submitHandler}>Sign Up</Button>
        </VStack>
    )
}

export default SignUp;
