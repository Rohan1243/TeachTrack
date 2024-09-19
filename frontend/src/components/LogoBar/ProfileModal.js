import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from "@chakra-ui/react";


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { color } from "framer-motion";

export const ProfileModal = ({ isOpen, onClose, teacherDetails }) => {
  const navigate = useNavigate();
  if (!teacherDetails) {
    return null; // or handle the case where teacherDetails is null
  }



  const handleLogout = () => {
    axios.get('/logout')
      .then(res => {
        localStorage.clear();
        navigate("/login");
      });
  };
  const handleReset = () => {
    navigate("/resetpassword");
  }

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="#0f172a"
        color="white"
        borderRadius="md"
        position="absolute"
        // top="10vh"
        // left='30%'
        // width="700px"
        // height="425px"
        boxShadow="0px 10px 100px rgba(0, 0, 0, 1)"
      >
        <ModalHeader fontSize="50px" fontFamily="Work Sans" textAlign="center">
          {teacherDetails.name}
        </ModalHeader>
        <ModalCloseButton position="absolute" left='20px' top="15px" />
        <ModalBody textAlign="center" display='flex' flexDir='column'>
          
          <Text
            fontSize='20px'
            fontFamily="Work Sans"
            marginBottom="20px"
          >
           {teacherDetails.email}
          </Text>
          <FontAwesomeIcon
            icon={faUserCircle}
            size="8x"
            style={{ marginBottom: "20px" }}
          />
          {/* Additional content can be added here */}
        </ModalBody>
        <ModalFooter justifyContent="center" display='flex' gap='100px' marginTop='30px'>
          <Button bg="blue" color='white' px='50px' py='8px' fontSize='15px' _hover='black' borderRadius='20px' fontWeight='bold' onClick={handleReset}>
            Reset Password
          </Button>
          <Button bg="red" color='white' px='80px' py='8px' fontSize='15px' _hover='black' borderRadius='20px' fontWeight='bold' onClick={handleLogout}>
            Logout
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
