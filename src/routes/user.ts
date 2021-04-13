import express from 'express';
import {
    checkUser,
} from '../handlers/start';
import {
    changePassword,
    login,
    newUser,
} from '../handlers/user';
import check from '../middlewares/check';

const router = express.Router();

router.use(check);

router.get('/check/:userId', check, checkUser);
router.post('/register', check, newUser);
router.post('/login', check, login);
router.post('/password', check, changePassword);

export default router;
