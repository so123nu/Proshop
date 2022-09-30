import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';

const ProfileScreen = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState(null);

    //to redirect
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirect = '/login';


    //fetch user info from state
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    //fetch user login info from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    //fetch user orders from state
    const orderListMy = useSelector(state => state.orderListMy)
    const { loading: loadingOrders, error: errorOrders, orders } = orderListMy

    //user profile update data
    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    useEffect(() => {
        if (!userInfo) {
            navigate(redirect)
        } else {
            if (!user.name) {
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())

            } else {
                setName(user.name)
                setEmail(user.email)
            }
        }


    }, [dispatch, navigate, user, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(password.length)

        if (password.length > 0 && password !== confirmPassword) {
            setMessage('Password & Confirm Password do not match!')
        } else {
            setMessage(null)
            //Dispatch Update Profile\
            dispatch(updateUserProfile({ id: user._id, name, email, password }))


        }
    }

    return (
        <Row>
            <Col md={3}>
                <h2>User Profile</h2>
                {message && <Message variant="danger"> {message} </Message>}
                {error && <Message variant="danger"> {error} </Message>}
                {success && <Message variant="success"> Profile Updated </Message>}
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

                    <Button variant="primary" className="mt-3" type="submit"> Update </Button>
                </Form>

            </Col>
            <Col md={9}>
                <h2> My Orders </h2>
                {
                    loadingOrders ? <Loader /> : error ?
                        <Message variant="danger">{errorOrders} </Message>
                        : orders.length > 0 ? (
                            <Table striped bordered hover className="table-sm">
                                <thead>
                                    <tr>
                                        <th> Order Id </th>
                                        <th> Date </th>
                                        <th> Total </th>
                                        <th> Payment Status </th>
                                        <th> Delivery Status </th>
                                        <th> Details </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td> {order._id} </td>
                                            <td> {order.createdAt.substring(0, 10)} </td>
                                            <td> ${order.totalPrice} </td>
                                            <td> {order.paidAt ? order.paidAt.substring(0, 10) :
                                                <i className="fas fa-times" style={{ color: "red" }} />
                                            } </td>
                                            <td> {order.isDelivered ? order.deliveredAt.substring(0, 10) :
                                                <i className="fas fa-times" style={{ color: "red" }} />
                                            } </td>

                                            <td>
                                                <LinkContainer to={`/order/${order._id}`}>
                                                    <Button variant="dark" className="btn-sm"> View </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </Table>
                        ) :

                            (
                                <Message variant="warning">You do not have any orders placed.!</Message>
                            )
                }
            </Col>
        </Row >
    )
}

export default ProfileScreen
