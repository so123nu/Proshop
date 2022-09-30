import React, { useState, useEffect } from 'react'
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutStep from '../components/CheckoutStep';

const PaymentScreen = () => {

    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    if (!shippingAddress) {
        navigate('/shipping');
    }

  
   

    const [paymentMethod, setpaymentMethod] = useState('Paypal');


    const redirect = '/login';

    //fetch user login info from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (!userInfo) {
            navigate(redirect)
        }

    }, [dispatch, navigate, userInfo, redirect])


    const submitHandler = (e) => {
        e.preventDefault();

        //dispatch action
        dispatch(savePaymentMethod(paymentMethod))

        navigate('/placeorder');

    }

    return (
        <FormContainer>
            <CheckoutStep step1 step2 step3 />
            <h1> Payment Method </h1>
            <Form onSubmit={submitHandler}>

                <Form.Group controlId="address" className="mt-2">
                    <Form.Label as="legend"> Select Method </Form.Label>

                    <Col>
                        <Form.Check onChange={e => setpaymentMethod(e.target.value)} type="radio" checked label="Paypal or Credit Card" id="paypal" name="paymentMethod" value="paypal"></Form.Check>
                    </Col>

                    <Col>
                        <Form.Check onChange={e => setpaymentMethod(e.target.value)} type="radio" checked label="Stripe" id="paypal" name="paymentMethod" value="paypal"></Form.Check>
                    </Col>
                </Form.Group>


                <Button type="submit" variant="primary" className="mt-3"> Continue </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
