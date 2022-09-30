import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

const LoginScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //to redirect
    const navigate = useNavigate();


    const redirect = '/';

    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin)
    const { loading, error, userInfo } = userLogin

    useEffect(() => {

        if (userInfo) {
            navigate(redirect)
        }
    }, [userInfo, redirect, navigate])

    const submitHandler = (e) => {
        e.preventDefault();

        //Dispatch Login
        dispatch(login(email, password))
    }

    return (
        <FormContainer>
            <Card className="p-4">
                <h1>Sign In</h1>
                {error && <Message variant="danger"> {error} </Message>}
                {loading && <Loader>  </Loader>}
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId="email" className="mt-2" >
                        <Form.Label> Email Address </Form.Label>
                        <Form.Control type="text" type="email" placeholder="Enter Your Email" value={email}
                            onChange={e => setEmail(e.target.value)} />

                    </Form.Group>

                    <Form.Group controlId="password" className="mt-2">
                        <Form.Label> Password </Form.Label>
                        <Form.Control type="password" placeholder="Enter Your Password" value={password}
                            onChange={e => setPassword(e.target.value)} />

                    </Form.Group>

                    <Button variant="primary" className="mt-3" type="submit"> Sign In </Button>
                </Form>

                <Row className="py-3">
                    <Col >
                        New Customer ?  <Link to='/register'> Register</Link>
                    </Col>
                </Row>
            </Card>
        </FormContainer >
    )
}

export default LoginScreen
