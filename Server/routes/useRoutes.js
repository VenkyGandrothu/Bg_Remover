import express from 'express';
import { clerkWebhooks } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/webhoks', clerkWebhooks);
 
export default userRouter;

