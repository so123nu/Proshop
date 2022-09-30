import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../actions/cartActions';

const CartScreen = () => {

    //to redirect
    const navigate = useNavigate();

    //get route id of each product
    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const qty = searchParams && Number(searchParams.get('qty'))

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart)
    const { cartItems } = cart

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {

        if (id) {
            dispatch(addToCart(id, qty))
        }
    }, [dispatch, id, qty])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const redirectToShipping = () => {
        if (userInfo) {
            navigate('/shipping')
        } else {
            navigate('/login')
        }
    }

    return (
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? <Message>Your cart is empty <Link to='/' >Go Back </Link> </Message> :
                    <ListGroup variant="flush">
                        {cartItems.map(item =>
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>
                                        ${item.price}
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product, Number(e.target.value)))}>
                                            {
                                                [...Array(item.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))

                                            }
                                        </Form.Control>
                                    </Col>
                                    <Col md={2}>
                                        <Button type="button" variant="light" onClick={() => removeFromCartHandler(item.product)}> <i className="fa fa-trash" /></Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        )}
                    </ListGroup>}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2> Subtotal ({cartItems.reduce((acc, cur) => acc + cur.qty, 0)}) items </h2>
                        ${cartItems.reduce((acc, cur) => acc + cur.qty * cur.price, 0)}
                        </ListGroup.Item>

                        <Button type="button" onClick={redirectToShipping} className="btn-dark m-3 " >Proceed to Checkout</Button>

                    </ListGroup>
                </Card>

            </Col>

        </Row>
    )
}

export default CartScreen
