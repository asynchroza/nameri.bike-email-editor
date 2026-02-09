import ONE_TIME_PASSCODE from '../getConfiguration/sample/one-time-passcode';
import ORDER_ECOMMERCE from '../getConfiguration/sample/order-ecommerce';
import POST_METRICS_REPORT from '../getConfiguration/sample/post-metrics-report';
import RESERVATION_REMINDER from '../getConfiguration/sample/reservation-reminder';
import RESET_PASSWORD from '../getConfiguration/sample/reset-password';
import RESPOND_TO_MESSAGE from '../getConfiguration/sample/respond-to-message';
import SUBSCRIPTION_RECEIPT from '../getConfiguration/sample/subscription-receipt';
import WELCOME from '../getConfiguration/sample/welcome';

import { apiRequest } from './client';

export type SampleTemplateForSeed = {
  name: string;
  description?: string;
  configuration: unknown;
};

export const SAMPLE_TEMPLATES: SampleTemplateForSeed[] = [
  { name: 'Welcome', description: 'Welcome new users', configuration: WELCOME },
  { name: 'One-time passcode', description: 'OTP / verification code email', configuration: ONE_TIME_PASSCODE },
  { name: 'Order confirmation', description: 'E-commerce order receipt', configuration: ORDER_ECOMMERCE },
  { name: 'Post metrics report', description: 'Metrics summary report', configuration: POST_METRICS_REPORT },
  { name: 'Reservation reminder', description: 'Remind about upcoming reservation', configuration: RESERVATION_REMINDER },
  { name: 'Reset password', description: 'Password reset link', configuration: RESET_PASSWORD },
  { name: 'Respond to message', description: 'Reply to user message', configuration: RESPOND_TO_MESSAGE },
  { name: 'Subscription receipt', description: 'Subscription payment receipt', configuration: SUBSCRIPTION_RECEIPT },
];

/**
 * Creates each sample template via the API. Skips any that fail (e.g. duplicate name).
 * Call this when the templates list is empty to seed the database.
 */
export async function seedTemplates(): Promise<void> {
  for (const template of SAMPLE_TEMPLATES) {
    try {
      await apiRequest('/marketing/emails/templates', {
        method: 'POST',
        body: {
          name: template.name,
          description: template.description ?? null,
          configuration: template.configuration,
        },
      });
    } catch (err) {
      // Log and continue (e.g. 409 duplicate name, or auth/network errors)
      console.warn(`Failed to seed template "${template.name}"`, err);
    }
  }
}
