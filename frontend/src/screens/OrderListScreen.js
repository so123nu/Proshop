import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { LinkContainer } from 'react-router-bootstrap';
import { USER_DETAILS_RESET } from '../constants/userConstants';
import { listOrders } from '../actions/orderActions';


const OrderListScreen = () => {

    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList)
    const { orders, pages, page, loading, error } = orderList

    const redirect = '/login';
    //to redirect
    const navigate = useNavigate();
    const { pageNumber } = useParams();

    //fetch user login info from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    useEffect(() => {

        if (!userInfo) {
            navigate(redirect)
        }

        if (userInfo && !userInfo.isAdmin) {
            navigate('/profile')
        }

        dispatch(listOrders(pageNumber))
        dispatch({ type: USER_DETAILS_RESET })

    }, [dispatch, navigate, userInfo, pageNumber])



    return (
        <React.Fragment>
            <h1> Orders </h1>
            {loading ? <Loader /> : error ?
                <Message variant="danger"> {error} </Message> :

                orders.length < 0 ? <Message variant="info"> No orders Found </Message> :

                    (
                        <React.Fragment>
                            <Table striped bordered hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <td>Order Id</td>
                                        <td>User Name</td>
                                        <td>Date</td>
                                        <td>Total Price</td>
                                        <td>Paid On</td>
                                        <td>Delivery Status</td>
                                        <td>Action</td>
                                    </tr>

                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.user && order.user.name}</td>
                                            <td>{order.createdAt.substring(0, 10)}</td>
                                            <td>${order.totalPrice}</td>
                                            <td>{order.paidAt && order.paidAt.substring(0, 10)}</td>
                                            <td>{order.isDelivered ? <Button variant="success" disabled className="btn-sm">Delivered</Button> : <Button variant="danger" disabled className="btn-sm">Pending</Button>}</td>

                                            <td>
                                                <LinkContainer className="mr-3" to={`/order/${order._id}`}>
                                                    <Button variant="info" className="btn-sm">View Details</Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                            <Paginate pages={pages} page={page} keyword='' isAdmin={true} showOrderList={true}></Paginate>
                        </React.Fragment>
                    )

            }

        </React.Fragment>
    )
}

export default OrderListScreen
