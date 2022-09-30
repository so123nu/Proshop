import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutStep from '../components/CheckoutStep';

const ShippingScreen = () => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart;

    const redirect = '/login';

    //fetch user login info from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address);
    const [city, setCity] = useState(shippingAddress.city);
    const [country, setCountry] = useState(shippingAddress.country);
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);

    const submitHandler = (e) => {
        e.preventDefault();

        //dispatch action
        dispatch(saveShippingAddress({ address, city, postalCode, country }))

        navigate('/payment');

    }

    useEffect(() => {
        if (!userInfo) {
            navigate(redirect)
        }

    }, [dispatch, navigate, userInfo, redirect])


    return (
        <FormContainer>
            <CheckoutStep step1 step2 />
            <h1> Shipping </h1>
            <Form onSubmit={submitHandler}>

                <Form.Group controlId="address" className="mt-2">
                    <Form.Label> Address </Form.Label>
                    <Form.Control type="text" required placeholder="Enter Your Address" value={address}
                        onChange={e => setAddress(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="city" className="mt-2">
                    <Form.Label> City </Form.Label>
                    <Form.Control type="text" required placeholder="Enter Your City" value={city}
                        onChange={e => setCity(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="postal_code" className="mt-2">
                    <Form.Label> Postal Code </Form.Label>
                    <Form.Control type="number" required placeholder="Enter Your Postal Code" value={postalCode}
                        onChange={e => setPostalCode(e.target.value)} />
                </Form.Group>

                <Form.Group controlId="country" className="mt-2">
                    <Form.Label> Country </Form.Label>
                    <Form.Control type="text" required placeholder="Enter Your Country" value={country}
                        onChange={e => setCountry(e.target.value)} />
                </Form.Group>

                <Button type="submit" variant="primary" className="mt-3"> Continue </Button>
            </Form>
        </FormContainer>
    )
}

export default ShippingScreen
