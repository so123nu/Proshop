import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

const EditProductScreen = () => {

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

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const redirect = '/login';

    const { id } = useParams();

    //fetch user login info from state
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    // const productCreate = useSelector(state => state.productCreate)
    // const { success, error, loading } = productCreate


    const productDetails = useSelector(state => state.productDetails)
    const { success: successDetails, error: errorDetails, loading: loadingDetails, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = productUpdate

    const submitHandler = (id) => {
        dispatch(updateProduct({ _id: id, name, category, brand, image, description, price, countInStock, numReviews }))
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

    useEffect(() => {

        if (!userInfo) {
            navigate(redirect)
        }

        if (userInfo && !userInfo.isAdmin) {
            navigate('/profile')
        }

        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET })
            navigate('/productlist')
        } else {
            if (!product.name || product._id !== id) {

                dispatch(listProductDetails(id))
            } else {
                if (successDetails) {
                    setName(product.name)
                    setCategory(product.category)
                    setBrand(product.brand)
                    setPrice(product.price)
                    setDescription(product.description)
                    setNumReviews(product.numReviews)
                    setImage(product.image)
                    setCountInStock(product.countInStock)
                }
            }
        }


    }, [dispatch, navigate, product, id, successUpdate, userInfo, successDetails])

    return (
        <Container>

            <Row className="align-items-center">
                <Col md={6} className="offset-md-3">
                    <Link className="btn btn-light my-3" to="/productlist"> Go Back </Link>
                    <h1> Edit Product </h1>
                    {loadingDetails && <Loader />}
                    {loadingUpdate && <Loader />}
                    {errorDetails && <Message variant="danger"> {errorDetails} </Message>}
                    {errorUpdate && <Message variant="danger"> {errorUpdate} </Message>}
                    <Form>
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
                        <Row className="d-flex mt-3">
                            <Button variant="primary" onClick={() => submitHandler(product._id)} className="btn-md">Update</Button>
                            <Link to="/productlist" className="btn btn-md btn-warning  ml-2">Go Back</Link>
                        </Row>
                    </Form>

                </Col>
            </Row>

        </Container>
    )
}

export default EditProductScreen
