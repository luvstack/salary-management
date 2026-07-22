import { NextFunction, Request, Response } from 'express';

import { AnalyticsService } from '@src/services';
import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';

export class Analytic {
  static async getCompensationAnalytics(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await AnalyticsService.Analytic.getCompensationAnalytics();

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}