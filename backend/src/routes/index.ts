import { Router } from 'express';

import employee from './employee.route';
import analytics from './analytics.route';

const router = Router();

router.use('/employees', employee);
router.use('/analytics', analytics)

export default router;