import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  ListGroup,
  ListGroupItem,
  Row,
} from "react-bootstrap";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import { io } from "socket.io-client";

const ADDRESS = "https://itransition-chat.herokuapp.com"; // <-- address of the BACKEND PROCESS
const socket = io(ADDRESS, { transports: ["websocket"] });
const HomePage = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [room, setRoom] = useState("blue");
  const [singleRecipient, setSingleRecipient] = useState(null);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connection established!");
    });
    socket.on("loggedin", () => {
      console.log("you're logged in!");
      setLoggedIn(true);
      fetchOnlineUsers();
      socket.on("newConnection", () => {
        console.log("watch out! a new challenger appears!");
        fetchOnlineUsers();
      });
    });

    socket.on('output-messages', data => {
      console.log("output data", data)
      setChatHistory(data);
    })
    socket.on("message", (newMessage) => {
      console.log("a new message appeared!", newMessage);
      setChatHistory((chatHistory) => [...chatHistory, newMessage]);
    });
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    socket.emit("setUsername", { username: username, room: room });
  };

  const handleMessageSubmit = async(e) => {
    e.preventDefault();

    const newMessage = {
      text: message,
      sender: username,
      socketId: socket.id,
    };

    socket.emit("sendmessage", {
      message: newMessage,
      room: singleRecipient ?? room,
    });
    setChatHistory([...chatHistory, newMessage]);
    setMessage("");

  };

  const fetchOnlineUsers = async () => {
    try {
      let response = await fetch(ADDRESS + "/online-users");
      if (response) {
        let data = await response.json();
        setOnlineUsers(data.onlineUsers);
      } else {
        console.log("error fetching the online users");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnSearch = (string, results) => {
    if(room === 'blue'){
        setOnlineUsers(onlineUsers.filter((user) => user.room === "blue"))
    }else if(room === 'red'){
        setOnlineUsers(onlineUsers.filter((user) => user.room === "red"))
    }
  };
  const handleOnHover = (result) => {
    return onlineUsers.filter((user) => user.room === room)
      
  };
  const handleOnSelect = (item) => {
    setSingleRecipient(item.id);
  };
  const handleOnFocus = () => {};
  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: "block", textAlign: "left" }}>
          {item.username}
        </span>
      </>
    );
  };
  return (
    <Container fluid className="px-4">
      <Row className="my-3" style={{ height: "95vh", width:"90vw" }}>
        <Col md={10} className="d-flex flex-column justify-content-between">
          {/* for the main chat window */}
          {/* 3 parts: username input, chat history, new message input */}
          {/* TOP SECTION: USERNAME INPUT FIELD */}
          <Form onSubmit={handleUsernameSubmit} className="d-flex">
            <FormControl
              placeholder="Insert your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loggedIn}
            />
            {!singleRecipient ? (
              <Button
                className="ml-2"
                variant={room === "blue" ? "primary" : "danger"}
                onClick={() => setRoom(room === "blue" ? "red" : "blue")}
              >
                Room
              </Button>
            ) : (
              <Button
                className="ml-2"
                variant={"secondary"}
                onClick={() => setSingleRecipient(null)}
              >
                Back to the previous room
              </Button>
            )}
          </Form>
          {/* MIDDLE SECTION: CHAT HISTORY */}
          <ListGroup>
            {chatHistory.map((message, i) => (
              <ListGroupItem key={i} className="rounded-pill my-3">
                <strong>{message.sender}</strong>
                <span className="mx-1"> | </span>
                <span>{message.text}</span>
              </ListGroupItem>
            ))}
          </ListGroup>
          {/* BOTTOM SECTION: NEW MESSAGE INPUT FIELD */}
          <Form onSubmit={handleMessageSubmit}>
            <FormControl
              placeholder="Insert your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!loggedIn}
            />
          </Form>
        </Col>
        <Col md={2} style={{ borderLeft: "2px solid black" }}>
          {/* for the currently connected clients */}
          <div style={{ width: 400 }}>
            <ReactSearchAutocomplete
              fuseOptions={{ keys: ["username"] }}
              resultStringKeyName="username"
              items={onlineUsers}
              onSearch={handleOnSearch}
              onHover={handleOnHover}
              onSelect={handleOnSelect}
              onFocus={handleOnFocus}
              autoFocus
              formatResult={formatResult}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
