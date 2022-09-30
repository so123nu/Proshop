import React, { useEffect, useState, getState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Form, Row, Col, Table, Button, Image } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import { LinkContainer } from 'react-router-bootstrap';
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants';
import axios from 'axios';

const ProductListScreen = () => {

    //modal state
    const [show, setShow] = useState(false);

    //product state
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [countInStock, setCountInStock] = useState(0);
    const [numReviews, setNumReviews] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { pageNumber } = useParams();

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList)
    const { products, pages, page, loading, error } = productList

    const redirect = '/login';
    //to redirect
    const navigate = useNavigate();

    //fetch user login info from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productDelete = useSelector(state => state.productDelete)
    const { message, success: successDelete, error: errorDelete, loading: loadingDelete } = productDelete

    const productCreate = useSelector(state => state.productCreate)
    const { success: successCreate, error: errorCreate, loading: loadingCreate } = productCreate

    useEffect(() => {

        if (!userInfo) {
            navigate(redirect)
        }

        if (userInfo && !userInfo.isAdmin) {
            navigate('/profile')
        }

        dispatch(listProducts('', pageNumber))

        if (successDelete) {
            dispatch(listProducts())
        }

        if (successCreate) {
            setName('')
            setCategory('')
            setBrand('')
            setPrice(0)
            setDescription('')
            setNumReviews(0)
            setImage('')
            setCountInStock(0)
        }

        dispatch({ type: PRODUCT_DETAILS_RESET })


    }, [dispatch, navigate, userInfo, successDelete, successCreate, pageNumber])

    const createProductHandler = () => {
        dispatch(createProduct({ name, category, brand, image, description, price, countInStock, numReviews }))

    }

    const deleteHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

            const { data } = await axios.post('/api/upload', formData, config)

            setImage(data);
            setUploading(false);

        } catch (error) {
            setUploading(false)
            console.log(error)
        }
    }

    return (
        <React.Fragment>
            <Row className="align-items-center">
                <Col> <h1> Products </h1> </Col>
                <Col className="text-right">
                    <Button className="my-3" variant="primary" onClick={handleShow}>
                        <i className="fas fa-plus"></i> Create Product
                    </Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header>
                            <Modal.Title>Create Product</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {successCreate && <Message variant="success"> Product Created Successfully! </Message>}
                            {loadingCreate && <Loader />}
                            {errorCreate && <Message variant="danger"> {errorCreate} </Message>}
                            <Form >
                                <Form.Group controlId="name" className="mt-2" >
                                    <Form.Label> Name </Form.Label>
                                    <Form.Control type="text" placeholder="Product Name" value={name}
                                        onChange={e => setName(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="category" className="mt-2" >
                                    <Form.Label> Category </Form.Label>
                                    <Form.Control type="text" placeholder="Product Category" value={category}
                                        onChange={e => setCategory(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="brand" className="mt-2" >
                                    <Form.Label> Brand </Form.Label>
                                    <Form.Control type="text" placeholder="Product Brand" value={brand}
                                        onChange={e => setBrand(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="image" className="mt-2" >
                                    <Form.Label> Image </Form.Label>
                                    <Form.Control type="text" placeholder="Product Image" value={image}
                                        onChange={e => setImage(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Select File</Form.Label>
                                    <Form.Control type="file" onChange={uploadFileHandler} />
                                </Form.Group>
                                {uploading && <Loader />}
                                <Form.Group controlId="price" className="mt-2" >
                                    <Form.Label> Price </Form.Label>
                                    <Form.Control type="num" placeholder="Product Price" value={price}
                                        onChange={e => setPrice(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="price" className="mt-2" >
                                    <Form.Label> Count In Stock </Form.Label>
                                    <Form.Control type="num" placeholder="Product Stock Count" value={countInStock}
                                        onChange={e => setCountInStock(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="numReviews" className="mt-2" >
                                    <Form.Label> Num Reviews </Form.Label>
                                    <Form.Control type="num" placeholder="Product Reviws Count" value={numReviews}
                                        onChange={e => setNumReviews(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="description" className="mt-2" >
                                    <Form.Label> Description </Form.Label>
                                    <Form.Control as="textarea" placeholder="Product Reviws Count" value={description}
                                        onChange={e => setDescription(e.target.value)} />
                                </Form.Group>
                            </Form>

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={createProductHandler}>
                                <i className="fas fa-plus" /> Create
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
            {successDelete && <Message variant="success">{message} </Message>}
            {loadingDelete && <Loader />}
            {errorDelete && <Message variant="danger"> {errorDelete} </Message>}
            {loading ? <Loader /> : error ?
                <Message variant="danger"> {error} </Message> :

                products.length < 0 ? <Message variant="info"> No products Found </Message> :

                    (
                        <React.Fragment>
                            <Table striped bordered hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <td>Product</td>
                                        <td>Name</td>
                                        <td>Price</td>
                                        <td>Category</td>
                                        <td>Brand</td>
                                        <td>Stock Count</td>
                                        <td>Action</td>
                                    </tr>

                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product._id}>
                                            <td className="bg-secondary">
                                                <Link to={`/product/${product._id}`}>
                                                    <Image src={product.image} style={{
                                                        height: "50px"
                                                    }} fluid rounded />
                                                </Link>
                                            </td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>{product.category}</td>
                                            <td>{product.brand}</td>
                                            <td>{product.countInStock}</td>
                                            <td>
                                                <LinkContainer className="mr-2" to={`/product/${product._id}/edit`}>
                                                    <Button variant="dark" className="btn-sm"><i className="fas fa-edit" /></Button>
                                                </LinkContainer>
                                                <Button variant="danger" onClick={() => deleteHandler(product._id)} className="btn-sm"><i className="fas fa-trash" /></Button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </Table>
                            <Paginate pages={pages} page={page} keyword='' isAdmin={true}></Paginate>
                        </React.Fragment>
                    )

            }

        </React.Fragment>
    )
}

export default ProductListScreen
