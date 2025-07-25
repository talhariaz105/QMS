import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../utils';
import * as subscriptionService from './subscription.service';

/**
 * Helper to get the effective user ID (handles subAdmin case)
 */
function getEffectiveUserId(req: Request): string | undefined {
  if (req.user?.role === 'subAdmin') {
    return req.user?.createdBy?.toString();
  }
  return req.user?.id;
}

/**
 * Create subscription
 */
export const createSubscription = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { planId, priceId, paymentMethodId, billingCycle } = req.body;

  if (req.user.role !== 'admin') {
    res.status(httpStatus.FORBIDDEN).json({
      success: false,
      message: 'Only admin can create subscriptions',
    });
    return;
  }

  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const subscription = await subscriptionService.createSubscription({
    userId,
    planId,
    priceId,
    paymentMethodId,
    billingCycle,
  });

  res.status(httpStatus.CREATED).json({
    success: true,
    data: subscription,
    message: 'Subscription created successfully',
  });
});

/**
 * Get user's current subscription
 */
export const getCurrentSubscription = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const subscription = await subscriptionService.getUserSubscription(userId);

  res.status(httpStatus.OK).json({
    success: true,
    data: subscription,
  });
});

export const getActiveSubscription = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;
  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  let subscription;

  console.log('User role:', req.user.role);

  if (req.user.role === 'subAdmin') {
    const modules = req.user.adminOF || [];
    const getModules = modules?.map((module: any) => module.method?.toString());
    subscription = await subscriptionService.getSubAdminModules(getModules);
  } else {
    subscription = await subscriptionService.getActiveSubscriptionwithPlan(userId);
  }

  res.status(httpStatus.OK).json({
    success: true,
    data: subscription,
  });
});

export const getmodulesNameAndWorkspaces = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const modules = await subscriptionService.getUserSubscriptionsandWorkspaces(userId);

  res.status(httpStatus.OK).json({
    success: true,
    data: modules,
  });
});

/**
 * Update subscription
 */
export const updateSubscription = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { subscriptionId } = req.params;
  const { newPriceId, newPaymentMethodId, cancelAtPeriodEnd } = req.body;

  if (!subscriptionId) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Subscription ID is required',
    });
    return;
  }

  const subscription = await subscriptionService.updateSubscription({
    subscriptionId,
    newPriceId,
    newPaymentMethodId,
    cancelAtPeriodEnd,
  });

  res.status(httpStatus.OK).json({
    success: true,
    data: subscription,
    message: 'Subscription updated successfully',
  });
});

/**
 * Cancel subscription
 */
export const cancelSubscription = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Subscription ID is required',
    });
    return;
  }

  const subscription = await subscriptionService.cancelSubscription(subscriptionId);

  res.status(httpStatus.OK).json({
    success: true,
    data: subscription,
    message: 'Subscription canceled successfully',
  });
});

export const updatePaymentMethod = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { paymentMethodId } = req.body;
  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const customerId = await getUserStripeCustomerId(userId);

  await subscriptionService.updatePaymentMethod({
    customerId,
    paymentMethodId,
  });

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Payment method updated successfully',
  });
});

/**
 * Get payment methods
 */
export const getPaymentMethods = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const customerId = await getUserStripeCustomerId(userId);
  const paymentMethods = await subscriptionService.getPaymentMethods(customerId);

  res.status(httpStatus.OK).json({
    success: true,
    data: paymentMethods,
  });
});

/**
 * Create setup intent for adding payment method
 */
export const createSetupIntent = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const customerId = await getUserStripeCustomerId(userId);
  const setupIntent = await subscriptionService.createSetupIntent(customerId);

  res.status(httpStatus.OK).json({
    success: true,
    data: setupIntent,
  });
});

/**
 * Create customer portal session
 */
export const createCustomerPortalSession = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { returnUrl } = req.body;
  const userId = getEffectiveUserId(req);

  if (!userId) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'User not authenticated',
    });
    return;
  }

  const customerId = await getUserStripeCustomerId(userId);
  const session = await subscriptionService.createCustomerPortalSession(customerId, returnUrl);

  res.status(httpStatus.OK).json({
    success: true,
    data: session,
  });
});

/**
 * Handle Stripe webhook
 */
export const handleWebhook = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const event = req.body;

  try {
    await subscriptionService.handleWebhookEvent(event);
    res.status(httpStatus.OK).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Webhook error',
    });
  }
});

// Helper function - you'll need to implement this based on your user model
async function getUserStripeCustomerId(userId: string): Promise<string> {
  // Use the service function
  return await subscriptionService.getUserStripeCustomerId(userId);
}
