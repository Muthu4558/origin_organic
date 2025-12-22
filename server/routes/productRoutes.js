import express from 'express';
import multer from 'multer';
import {
  createProduct,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addProductReview,
  canReviewProduct 
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), createProduct);
router.get('/id/:id', getProductById);
router.post('/:id/review', protect, addProductReview);
router.get('/featured/all', getFeaturedProducts);
router.get('/', getAllProducts);
router.get("/:id/can-review", protect, canReviewProduct);
router.get('/:category', getProductsByCategory);
router.put('/update/:id', upload.single('image'), updateProduct);
router.delete('/delete/:id', deleteProduct);


export default router;