import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_DETAILS_RESET, USER_UPDATE_RESET } from '../constants/userConstants';


const UserEditScreen = () => {

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    //to redirect
    const navigate = useNavigate();
    const redirect = '/';

    //get route id of each product
    const { id } = useParams();

    const dispatch = useDispatch();
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {
        if (userInfo == null || userInfo && !userInfo.isAdmin) {
            navigate(redirect)
        } else {
            if (successUpdate) {
                dispatch({ type: USER_UPDATE_RESET })
                navigate('/userlist');
            } else {
                if (!user.name) {
                    dispatch(getUserDetails(id))
                } else {
                    setName(user.name)
                    setEmail(user.email)
                    setIsAdmin(user.isAdmin)
                }
            }
        }



    }, [dispatch, navigate, successUpdate, userInfo, user, id])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(updateUser({ _id: user._id, name, email, isAdmin }));

    }

    return (
        <React.Fragment>
            <Link to="/userlist" className="btn btn-light my-3" > Go Back </Link>

            <FormContainer>
                <Card className="p-4">
                    <h1>Edit User</h1>
                    {loading && <Loader />}
                    {loadingUpdate && <Loader />}
                    {errorUpdate && <Message variant="danger"> {errorUpdate} </Message>}
                    {/* {message && <Message variant="danger"> {message} </Message>} */}
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

                        <Form.Group controlId="isAdmin" className="mt-2">
                            <Form.Check type="checkbox" label="is Admin" checked={isAdmin}
                                onChange={e => setIsAdmin(e.target.checked)} />
                        </Form.Group>



                        <Button variant="primary" className="mt-3" type="submit"> Update </Button>
                    </Form>

                </Card>
            </FormContainer >
        </React.Fragment >

    )
}

export default UserEditScreen
