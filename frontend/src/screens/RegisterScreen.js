import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';


const RegisterScreen = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    //to redirect
    const navigate = useNavigate();

    const redirect = '/';

    const dispatch = useDispatch();
    const userRegister = useSelector(state => state.userRegister)
    const { loading, error, userInfo } = userRegister

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Password & Confirm Password do not match!')
        } else {
            setMessage(null)
            //Dispatch Register
            dispatch(register(name, email, password))
        }
    }

    return (
        <FormContainer>
            <Card className="p-4">
                <h1>Register</h1>
                {message && <Message variant="danger"> {message} </Message>}
                {error && <Message variant="danger"> {error} </Message>}
                {loading && <Loader>  </Loader>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="name" className="mt-2" >
                        <Form.Label> Name </Form.Label>
                        <Form.Control type="text" placeholder="Enter Your Name" value={name}
                            onChange={e => setName(e.target.value)} />

                    </Form.Group>

                    <Form.Group controlId="email" className="mt-2" >
                        <Form.Label> Email Address </Form.Label>
                        <Form.Control type="email" placeholder="Enter Your Email" value={email}
                            onChange={e => setEmail(e.target.value)} />

                    </Form.Group>

                    <Form.Group controlId="password" className="mt-2">
                        <Form.Label> Password </Form.Label>
                        <Form.Control type="password" placeholder="Enter Your Password" value={password}
                            onChange={e => setPassword(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword" className="mt-2">
                        <Form.Label> Confirm Password </Form.Label>
                        <Form.Control type="password" placeholder="Enter Confirm Password" value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)} />

                    </Form.Group>

                    <Button variant="primary" className="mt-3" type="submit"> Register </Button>
                </Form>

                <Row className="py-3">
                    <Col >
                        Have an account?  <Link to='/login'> Login</Link>
                    </Col>
                </Row>
            </Card>
        </FormContainer >
    )
}

export default RegisterScreen
