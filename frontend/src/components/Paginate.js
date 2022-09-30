import React from 'react'
import { Pagination } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Paginate = ({ pages, page, isAdmin = false, showUserList = false, showOrderList = false, keyword = '' }) => {
    return pages > 1 && (
        <Pagination>
            {[...Array(pages).keys()].map(x => (
                <LinkContainer key={x + 1} to={!isAdmin ? keyword ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}` : isAdmin && !showUserList && !showOrderList ? `/productlist/${x + 1}` : isAdmin && showUserList && !showOrderList ? `/userlist/${x + 1}` : isAdmin && !showUserList && showOrderList && `/orderlist/${x + 1}`}>
                    <Pagination.Item active={(x + 1) === page} activeLabel="">{x + 1}</Pagination.Item>
                </LinkContainer>
            ))}
        </Pagination>
    )


}

export default Paginate
