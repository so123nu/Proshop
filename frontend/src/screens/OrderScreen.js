import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Row, Col, ListGroup, Image, Card, Badge, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { deliverOrder, getOrderDetails, listMyOrders, payOrder } from '../actions/orderActions';
import { PayPalButton } from "react-paypal-button-v2";
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';


const OrderScreen = () => {

    // const cart = useSelector(state => state.cart)
    // const { shippingAddress } = cart;

    const dispatch = useDispatch();

    //get route id for created order
    const { id } = useParams();

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, error, loading } = orderDetails;

    const orderPay = useSelector(state => state.orderPay)
    const { success: successPay, loading: loadingPay } = orderPay;

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { success: successDeliver, loading: loadingDeliver } = orderDeliver;

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    if (!loading) {

        order.itemsPrice = order.orderItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0)
    }


    const upperCase = str => str.toUpperCase()

    const [sdkReady, setSdkReady] = useState(false);


    useEffect(() => {


        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            let script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
                setSdkReady(true)
            }

            document.body.appendChild(script)
        }

        if (!order || successPay || successDeliver || order._id !== id) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(listMyOrders())
            dispatch(getOrderDetails(id));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript()
            } else {
                setSdkReady(true)
            }
        }


    }, [id, dispatch, order, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) => {

        dispatch(payOrder(order._id, paymentResult))
    }

    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    return loading ? <Loader /> : error ? <Message variant="danger"> {error} </Message> :
        <React.Fragment>
            <h1> Order {order._id} </h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping </h2>
                            <p><strong>Name :  </strong> {upperCase(order.user.name)}</p>
                            <p><strong>Email :  </strong> <a href={`mail:to:${order.user.email}`}> {order.user.email} </a></p>
                            <p>
                                <strong> Address : </strong>
                                {order.shippingAddress.address},{order.shippingAddress.city},
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}

                            </p>
                            {order.isDelivered ? <Message variant="success"> Delivered on {order.deliveredAt.substring(0, 10)} </Message> : <Message variant="danger">  Delivery Pending </Message>}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method </h2>
                            <p>
                                <strong> Method : </strong>
                                {order.paymentMethod}

                            </p>
                            {order.paidAt ? <Message variant="success"> Paid on {order.paidAt.substring(0, 10)} </Message> : <Message variant="info"> Pending Payment </Message>}

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items </h2>
                            {order.orderItems.length === 0 ? (<Message> Your cart is Empty </Message>) :

                                (<ListGroup variant="flush">
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col> <Link to={`/product/${item._id}`}> {item.name}  </Link></Col>
                                                <Col md={4}> {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>)

                            }

                        </ListGroup.Item>

                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Order Summary {order.paidAt && <Badge bg="success" text="light">Success</Badge>}</ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Items  </Col>
                                    <Col> ${order.itemsPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Shipping  </Col>
                                    <Col> ${order.shippingPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Tax  </Col>
                                    <Col> ${order.taxPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Tax  </Col>
                                    <Col> ${order.totalPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.paidAt && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? <Loader /> : (
                                        <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler}></PayPalButton>
                                    )}
                                </ListGroup.Item>
                            )}
                            {loadingDeliver && <Loader />}
                            {
                                userInfo.isAdmin && order.paidAt && !order.isDelivered && (
                                    <ListGroup.Item>
                                        <Button type="button" className="btn btn-block" onClick={deliverHandler}> Mark As Delivered </Button>
                                    </ListGroup.Item>
                                )
                            }


                        </ListGroup>
                    </Card>
                </Col>

            </Row>
        </React.Fragment >
}

export default OrderScreen
