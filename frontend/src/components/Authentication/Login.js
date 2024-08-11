import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [credentials, setcredentials] = useState({ email: "", password: "" })
  const handleChange = (e) => {
    setcredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  const [show, setshow] = useState(false)
  const handleClick = (e) => {
    setshow(!show)
  }

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: credentials.email, password: credentials.password })
    })
    const data = await response.json()
    if (data.success) {
      // console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data))
      toast.success("LoggedIn Successfully")
      navigate("/chats")
    }

    if (!data.success) {
      // toast.error("User Not Found or Incorrect Password")
      toast.error(`User Not Found or Incorrect Password : ${data.errors[0].msg}`)
      console.log(data.errors[0].msg)
    }
  }
  return (
    <VStack spacing='5px' color='black'>
      <FormControl id="login-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input placeholder="Enter Your Email" name="email" value={credentials.email} onChange={handleChange}></Input>
      </FormControl>
      <FormControl id="login-password" isRequired>
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
      <Button colorScheme="blue" width='100%' style={{ marginTop: 15 }} onClick={submitHandler}>Login</Button>
    </VStack>
  )
}
