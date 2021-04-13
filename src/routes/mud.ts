import express from 'express';
import {
    startMud,
} from '../handlers/start';
import {
    exitMud,
    fastStart,
    runMud,
    testMode,
} from '../handlers/talker';
import check from '../middlewares/check';
import isAdmin from '../middlewares/isAdmin';

const router = express.Router();

router.use(check);

router.post('/', fastStart);
router.get('/info', startMud);
router.post('/main', runMud);
router.post('/exit', exitMud);
router.post('/test', isAdmin, testMode);

export default router;
