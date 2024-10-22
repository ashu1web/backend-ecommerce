import express from 'express'
import { isAuth } from '../middlewares/authMiddleware.js'
import { createCategory, deleteCategoryController, getAllCategoriesController, updateCategoryController } from '../controllers/categoryController.js'


const router=express.Router()


//routes

//CREATE CATEGORY
router.post("/create",isAuth,createCategory)

//GET ALL CATEGORY
router.get("/get-all",getAllCategoriesController)

//Delete Category
router.delete('/delete/:id',isAuth,deleteCategoryController)

// UPDATE ALL CATEGORY
router.put("/update/:id", isAuth,updateCategoryController);
export default router
