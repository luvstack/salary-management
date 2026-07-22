import { Router } from 'express';

import { AnalyticsController } from '@src/controllers';


const router = Router();


router.get(
  '/compensation',
  AnalyticsController.Analytic.getCompensationAnalytics,
);

export default router;