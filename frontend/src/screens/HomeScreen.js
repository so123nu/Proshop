import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import { Row, Col } from 'react-bootstrap';
import { listProducts } from '../actions/productActions';

const HomeScreen = () => {

    const { keyword } = useParams();
    let { pageNumber } = useParams();

    const dispatch = useDispatch();
    const productList = useSelector(state => state.productList);
    const { loading, error, products, pages, page } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, keyword, pageNumber])


    return (
        <>
            {/* {!keyword && <ProductCarousel />} */}
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'> {error} </Message> : (
                <React.Fragment>
                    <Row>
                        {products.length > 0 ? (
                            products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))
                        ) : (<Col sm={12} md={12} lg={12} xl={12}> <Message variant="danger"> No Products Found.! </Message> </Col>)}

                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}></Paginate>
                </React.Fragment>
            )}

        </>
    )
}

export default HomeScreen
