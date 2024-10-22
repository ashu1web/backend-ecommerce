import productModel from "../models/productModel.js"
import { getDataUri } from "../utils/features.js"
import cloudinary from 'cloudinary'
//GET ALL PRODUCTS
export const getAllProductsController=async (req,res)=>{
    const { keyword, category } = req.query;
    try{
          const products=await productModel.find({
            name: {
              $regex: keyword ? keyword : "",
              $options: "i",
            },
            // category: category ? category : null,
          })
          .populate("category");
          
          res.status(200).send({
            success:true,
            message:"all products fetched successfullly",
            products,
          })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in GET ALL PRODUCT API',
            error
        })
    }
}

//GET SINGLE PRODUCT
export const getSingleProductController=async(req,res)=>{
      try{
           //get product id
           const product=await productModel.findById(req.params.id)
           //validation
           if(!product){
                return res.status(404).send({
                    success:false,
                    message:'product not found'
                })
           }
           res.status(200).send({
              success:true,
              message:'Product found',
              product,
           })
      }catch(error){
        console.log(error)
        //Cast error || OBJECT ID
        if(error.name==="CastError"){
            return res.status(500).send({
                success:false,
                message:'Invalid Id',
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in GET SINGLE PRODUCT API',
            error
        })
      }
}

//CREATE PRODUCT
export const createProductController=async(req,res)=>{
    try{
         const {name,description,price,stock}=req.body 
         //validation
         if(!name || !description || !price || !stock){
            res.status(500).send({
                success:false,
                message:'Please Provide all fields'
            })
            if(!req.file){
                return res.status(500).send({
                    success:false,
                    message:'please provide product images'
                })
            }
            const file=getDataUri(req.file)
            const cdb=await cloudinary.v2.uploader(file.content)
            const image={
                public_id:cdb.public_id,
                url:cdb.secure_url
            }
         
            await productModel.create({
                name,description,price,category,stock,images:[image]
            })
            res.status(201).send({
                success:true,
                message:"product Created successfuly"
            })
         }
    }catch(error){
      res.status(500).send({
            success:false,
            message:'Error in GET SINGLE PRODUCT API',
            error,
        })
    }
}

//UPDATE PRODUCT
export const updateProductController=async(req,res)=>{
      try{
        //find product
        const product=await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(500).send({
                success:false,
                message:'Product not found',
            })
        }
        const [name,description,price,stock,category]=req.body
        //validate and update
        if(name)  product.name=name
        if(description)  product.description=description
        if(stock)  product.stock=stock            ////
        if(price)  product.price=price
        if(category) product.category=category

        await product.save()
        res.status(200).send({
            success:true,
            message:"product details updated"
        })
      }catch(error){
        console.log(error)
        if(error.name==="CastError"){
            return res.status(500).send({
                success:false,
                message:'Invalid Id',
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in UPDATE PRODUCT API',
            error,
        })
      }
}

//UPDATE PRODUCT IMAGE
export const updateProductImageController=async(req,res)=>{
    try{
       //find product
       const product=await productModel.findById(req.params.id)
       //validation
       if(!product){
          return res.status(404).send({
            success:false,
            message:'Product not found'
          })
       }
       //check file----->This file is coming from multer
       if(!req.file){
        return res.status(404).send({
            success:false,
            message:'Product not found'
          })
       }

       const file=getDataUri(req.file)
       const cdb=await cloudinary.v2.uploader(file.content)  //upload on cloudinary
       const image={
               public_id:cdb.public_id,
               url:cdb.secure_url
       }
       //save
       product.images.push(image)
       await product.save()
       res.status(200).send({
          sucess:true,
          message:"product image uploaded"
       })
    }catch(error){
        console.log(error)
        //cast error || OBJECT ID
        if(error.name==="CastError"){
            return res.status(500).send({
                success:false,
                message:'Invalid Id',
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in UPDATE PRODUCT API',
            error,
        })
    }
}

//DELETE PRODUCT IMAGE
export const deleteProductImageController=async(req,res)=>{
     try{
       //find product
       const product=await productModel.findById(req.params.id)
        //validation
        if(!product){
            return res.status(404).send({
              success:false,
              message:'Product not found'
            })
         }

         //image id find
         const id=req.query.id
         if(!id){
            return res.status(404).send({
                success:false,
                message:'Product image not found',
              })
         }

         let isExist=-1
         product.images.forEach((item,index)=>{
            if(item._id.toStirng()===id.toStirng()) isExist=index
         })
         if(isExist<0){
            return res.status(404).send({
                success:false,
                message:'Image not found',
              })
         }
        //DELETE PRODUCT IMAGE
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        product.images.splice(isExist,1);
        await product.save()
        return res.status(200).send({
            success:true,
            message:'Product Image Deleted Successfully',
          })
     }catch(error){
        console.log(error)
        //cast error || OBJECT ID
        if(error.name==="CastError"){
            return res.status(500).send({
                success:false,
                message:'Invalid Id',
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in DELETE Product IMAGE  API',
            error,
        })
    }
     
}

//DELETE PRODUCT
export const deleteProductController=async(req,res)=>{
     try{
       //find product
       const product=await productModel.findById(req.params.id)
       //validation
       if(!product){
           return res.status(404).send({
             success:false,
             message:'Product not found'
           })
        }
       //find and delete image cloudinary
       for(let index=0;index<product.images.length;index++){
           await cloudinary.v2.uploader.destroy(product.images[index].public_id)
       }
       await product.deleteOne()
       return res.status(200).send({        //diff if  i do not add return
        success:true,
        message:'Product Deleted Successfully'    ///////----
      })

     }catch(error){
        console.log(error)
        //cast error || OBJECT ID
        if(error.name==="CastError"){
            return res.status(500).send({
                success:false,
                message:'Invalid Id',
            })
        }
        res.status(500).send({
            success:false,
            message:'Error in DELETE Product IMAGE  API',
            error,
        })
    } 
}

// CREATE PRODUCT REVIEW AND COMMENT
export const productReviewController = async (req, res) => {
    try {
      const { comment, rating } = req.body;
      // find product
      const product = await productModel.findById(req.params.id);
      // check previous review
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).send({
          success: false,
          message: "Product Already Reviewed",
        });
      }
      // review object
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      // passing review object to reviews array
      product.reviews.push(review);
      // number of reviews
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      // save
      await product.save();
      res.status(200).send({
        success: true,
        message: "Review Added!",
      });
    } catch (error) {
      console.log(error);
      // cast error ||  OBJECT ID
      if (error.name === "CastError") {
        return res.status(500).send({
          success: false,
          message: "Invalid Id",
        });
      }
      res.status(500).send({
        success: false,
        message: "Error In Review Comment API",
        error,
      });
    }
  };

  