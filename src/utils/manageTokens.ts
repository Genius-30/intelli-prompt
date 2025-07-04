import { User } from '@/models/user.model';

export async function estimateTokens({ userId, tokenEstimated }: { userId: string, tokenEstimated: number }) {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) throw new Error('User not found');

    const remaining = user.tokenLimit - user.tokensUsed;
    if (remaining < tokenEstimated) throw new Error('Not enough tokens');

    return { success: true }
  } catch (err) {
    console.log('err estimating tokens', err)
    return { success: false }
  }
}

export async function deductTokens({ userId, tokensUsed }: { userId: string, tokensUsed: number }) {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) throw new Error('User not found');

    user.tokensUsed += tokensUsed;
    await user.save();

    return { success: true }
  } catch (err) {
    console.log('err while deducing tokens', err)
    return { success: false }
  }
}

export async function checkSubscription( { userId }: { userId: string }) {
  try {
    const user = await User.findById({ _id: userId });
    if (!user) throw new Error('User not found');

    const now = new Date()
    if(now > user.subscriptionEnd) throw new Error('subscription expired');
    
    return { success: true }
  } catch (err) {
    console.log('err while deducing tokens', err)
    return { success: false }
  }
}
