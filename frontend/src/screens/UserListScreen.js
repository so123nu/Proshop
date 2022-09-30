import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { getUserList, deleteUser } from '../actions/userActions';
import { LinkContainer } from 'react-router-bootstrap';
import { USER_DETAILS_RESET } from '../constants/userConstants';


const UserListScreen = () => {

    const dispatch = useDispatch();

    const userList = useSelector(state => state.userList)
    const { users, pages, page, loading, error } = userList

    const userDelete = useSelector(state => state.userDelete)
    const { success: successDelete } = userDelete

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

        dispatch(getUserList(pageNumber))
        dispatch({ type: USER_DETAILS_RESET })

    }, [dispatch, navigate, successDelete, userInfo, pageNumber])

    const deleteHandler = (user_id) => {
        dispatch(deleteUser(user_id))
    }

    return (
        <React.Fragment>
            <h1> Users </h1>
            {successDelete && <Message variant="success"> User Deleted Successfully! </Message>}
            {loading ? <Loader /> : error ?
                <Message variant="danger"> {error} </Message> :

                users.length < 0 ? <Message variant="info"> No users Found </Message> :

                    (
                        <React.Fragment>
                            <Table striped bordered hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <td>User Id</td>
                                        <td>Name</td>
                                        <td>Email</td>
                                        <td>Admin</td>
                                        <td>Action</td>
                                    </tr>

                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user._id}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className="text-center">
                                                {user.isAdmin ? <i className="fas fa-check" style={{ color: "green" }} /> : <i className="fas fa-times" style={{ color: "red" }} />}
                                            </td>
                                            <td>
                                                <LinkContainer className="mr-3" to={`/user/${user._id}/edit`}>
                                                    <Button variant="dark" className="btn-sm"><i className="fas fa-edit" /></Button>
                                                </LinkContainer>
                                                <Button variant="danger" onClick={() => deleteHandler(user._id)} className="btn-sm"><i className="fas fa-trash" /></Button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                            <Paginate pages={pages} page={page} isAdmin={true} showUserList={true}></Paginate>
                        </React.Fragment>
                    )

            }

        </React.Fragment>
    )
}

export default UserListScreen
