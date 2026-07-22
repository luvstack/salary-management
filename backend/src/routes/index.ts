import { Router } from 'express';

import employee from './employee.route';

const router = Router();

router.use('/employee', employee);

export default router;