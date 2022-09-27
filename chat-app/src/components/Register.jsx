import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import '../styles/index.css'
const Register = ({socket, username, setUsername}) => {
    const navigate = useNavigate()
    const submitUsername =(e)=>{
        e.preventDefault()
        socket.emit("setUsername", {username:username})
        navigate("/chatRoom")
      } 
  return (
    <Container>
      <Row className="p-5 d-flex flex-column justify-content-center">
        <Col>
        <h4 className="text-info text-center">Enter your name and start chatting</h4>
          <Form onSubmit={submitUsername}>
            <Form.Control
                className="rounded-pill inputs"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
export default Register;
