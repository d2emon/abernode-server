import express from 'express';
import check from '../middlewares/check';
import isAdmin from '../middlewares/isAdmin';
import {
    deleteUser,
    editUser,
    showUser,
} from '../handlers/user';

const router = express.Router();

router.use(check);
router.use(isAdmin);

router.get('/:userId', check, showUser);
router.put('/:userId', check, editUser);
router.delete('/:userId', check, deleteUser);

export default router;
