import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../actions/orderActions';
import CheckoutStep from '../components/CheckoutStep';
import Message from '../components/Message';


const PlaceOrderScreen = () => {

    const cart = useSelector(state => state.cart)

    const redirect = '/login';

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const orderCreate = useSelector(state => state.orderCreate)
    const { order, success, error } = orderCreate

    //user details
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const placeOrderHandler = () => {

        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
            itemsPrice: cart.itemsPrice,
        }))

        console.log(order)
    }

    useEffect(() => {
        if (!userInfo) {
            navigate(redirect)
        }
        if (success) {
            navigate(`/order/${order._id}`)
        }
        // eslint-disable-next-line
    }, [navigate, success])

    //Calculate Prices
    cart.itemsPrice = cart.cartItems.reduce((acc, cur) => acc + cur.price * cur.qty, 0)
    cart.shippingPrice = Number(cart.itemsPrice) > 1000 ? 10 : 100;
    cart.taxPrice = Number((0.15 * cart.itemsPrice)).toFixed(2);
    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2);


    return (
        <React.Fragment>
            <CheckoutStep step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping </h2>
                            <p>
                                <strong> Address : </strong>
                                {cart.shippingAddress.address},{cart.shippingAddress.city},
                                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}

                            </p>

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method </h2>
                            <p>
                                <strong> Method : </strong>
                                {cart.paymentMethod}

                            </p>

                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items </h2>
                            {cart.cartItems.length === 0 ? (<Message> Your cart is Empty </Message>) :

                                (<ListGroup variant="flush">
                                    {cart.cartItems.map((item, index) => (
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
                            <ListGroup.Item>Order Summary</ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Items  </Col>
                                    <Col> ${cart.itemsPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Shipping  </Col>
                                    <Col> ${cart.shippingPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Tax  </Col>
                                    <Col> ${cart.taxPrice}  </Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col> Tax  </Col>
                                    <Col> ${cart.totalPrice}  </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                {error && (<Message variant="danger">
                                    {error}
                                </Message>)}

                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Button type="button" onClick={placeOrderHandler} className="btn-block" disabled={cart.cartItems === 0}>
                                    Place Order
                                </Button>
                            </ListGroup.Item>


                        </ListGroup>
                    </Card>
                </Col>

            </Row>
        </React.Fragment >
    )
}

export default PlaceOrderScreen
