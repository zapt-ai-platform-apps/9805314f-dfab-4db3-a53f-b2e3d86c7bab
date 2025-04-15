import { z } from 'zod';
import { createValidator } from '../core/validators';

/**
 * Schema for dashboard content
 */
export const dashboardContentSchema = z.object({
  title: z.string(),
  content: z.string()
});

/**
 * Validator for dashboard content
 */
export const validateDashboardContent = createValidator(
  dashboardContentSchema, 
  'DashboardContent'
);