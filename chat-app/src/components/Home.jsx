import { useState } from "react";
import { BiSend } from 'react-icons/bi';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {
  Container,
  Row,
  Col,
  Form,
  ListGroup,
} from "react-bootstrap";
import '../styles/index.css'
const Home = ({socket, username, onlineUsers, chatHistory, setChatHistory}) => {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("")
 
  const handleSubmitMessage =(e)=> {
    e.preventDefault();
    const messageToSend = {
        to: recipient,
        text: message,
        sender: username,
        id: socket.id,
        timeStamp: Date.now()
    }
    socket.emit("privateMsg", messageToSend)
    setChatHistory([...chatHistory, messageToSend])
    setMessage("")
  }

  const handleOnSearch = (string, results) => {}
  const handleOnHover = (result) => {}
  const handleOnSelect = (item) => {
    // console.log("ITEM",item.id);
    setRecipient(item.id)
  }
  const handleOnFocus = () => {}
  const formatResult = (item) => {
    return (
      <>
        <span style={{ display: 'block', textAlign: 'left' }}>{item.username}</span>
      </>
    )
  }

  return (
    <Container fluid className="px-4">
      <Row className="my-3 d-flex justify-content-center" style={{ height: "95vh" }}>
        <Col md={6} className="p-4 d-flex flex-column justify-content-between chat-container">
          {/* USERNAME INPUT */}
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
          {/* MESSAGE BOX */}
          <ListGroup >
            {
              chatHistory.map((message, i)=> (
                <ListGroup.Item className="message-input my-1" key={i}>
                  <strong>{message.sender}</strong>
                  <span className="mx-1"> | </span>
                  <span>{message.text}</span>
                  <span className="ml-1" style={{fontSize:"0.7rem"}}>
                    {new Date(message.timeStamp).toLocaleTimeString('en-US')}
                  </span>
                </ListGroup.Item>

              ))
            }
          </ListGroup>
          {/* NEW MESSAGE INPUT */}
          <Form className="d-flex" >
            <Form.Control
            className="rounded-pill"
              type="text"
              placeholder="What is your message ?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <BiSend className="text-info" style={{fontSize:"39px"}} onClick={handleSubmitMessage}/>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
