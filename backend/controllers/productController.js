import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';



//@desc Fetch All Products
//@route GET /api/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
    //search based on keyword
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {};

    //pagination stuff
    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1
    const count = await Product.countDocuments({ ...keyword })

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));

    if (products) {
        res.status(200).json({ products, page, pages: Math.ceil(count / pageSize) });
    } else {
        throw new Error('Products Not found');
    }
})

//@desc Fetch Single Products
//@route GET /api/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        res.status(200).json(product);
    } else {
        throw new Error('Product Not found');
    }
})


//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        await product.remove();
        res.status(200).json({ message: "Product deleted successfully!" });
    } else {
        throw new Error('Product Not found');
    }
})

//@desc Create a product
//@route POST /api/products
//@access Private/admin
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock,
        user: req.user._id
    })

    const createdProduct = await product.save();

    if (createdProduct) {
        res.status(201).json(createdProduct);
    } else {
        throw new Error('Something Went Wrong');
    }
})


//@desc Update a product
//@route POST /api/products/:id
//@access Private/admin
const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);

    product.name = req.body.name || product.name;
    product.image = req.body.image || product.image;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.user = req.user._id;

    const updatedProduct = await product.save()

    if (updatedProduct) {
        res.status(200).json(updatedProduct);
    } else {
        res.status(400)
        throw new Error('Something Went Wrong');
    }
})

//@desc Create a review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    let product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if (alreadyReviewed) {
            res.status(400)
            throw new Error('Your Feedback is already received!');
        }

        const review = {
            name: req.user.name,
            rating,
            comment,
            user: req.user._id
        }

        product.reviews.push(review)
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

        await product.save();

        res.status(201).json({ message: "Review added!" });
    } else {
        res.status(400)
        throw new Error('Product Not found!');
    }
})

//@desc Fetch Top rated Products
//@route GET /api/products/top
//@access public
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3)

    if (products) {
        res.status(200).json(products);
    } else {
        throw new Error('Product Not found');
    }
})


export { getProducts, getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts }