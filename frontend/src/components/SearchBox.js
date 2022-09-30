import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`)
        } else {
            navigate('/')
        }
    }

    return (
        <Form onSubmit={submitHandler}>
            <Row>
                <Col md={9}>
                    <Form.Control type="text" name="q" onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search Products..." className="ml-md-4 ml-sm-0 mt-sm-2"></Form.Control>
                </Col>
                <Col md={3}>
                    <Button type="submit" variant="outline-success" className="p-2 mt-sm-3 mt-md-2">Search</Button>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchBox;