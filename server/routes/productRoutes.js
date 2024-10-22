import express from 'express'
import { createProductController, deleteProductController, deleteProductImageController, getAllProductsController, getSingleProductController, productReviewController, updateProductController, updateProductImageController } from '../controllers/productController.js'
import { isAuth } from '../middlewares/authMiddleware.js'
import { singleUpload } from '../middlewares/multer.js'

const router=express.Router()


//routes
//GET ALL Products
router.get('/get-all', getAllProductsController)

//GET SINGLE Products
router.get('/:id', getSingleProductController)

//CREATE PRODUCT     ----->post
router.get('/create',isAuth,singleUpload,createProductController)

//UPDATE PRODUCT
router.put('/:id',isAuth,updateProductController)

//UPDATE PRODUCT IMAGE
router.put('/image/:id',isAuth,singleUpload,updateProductImageController)

//DELETE PRODUCT IMAGE
router.delete('/delete-image/:id',isAuth,deleteProductImageController)

//DELETE PRODUCT
router.delete('/delete/:id',isAuth,deleteProductController)

// REVIEW PRODUCT
router.put("/:id/review", isAuth, productReviewController);

export default router
