import { sendMail } from '@/lib/sendMail';
import { Follow } from '@/models/follow.model';
import { User } from '@/models/user.model';
import { getAuthenticatedUser } from '@/utils/getAuthenticatedUser';

export async function POST(req: Request) {
  try {
    const { userId, error } = await getAuthenticatedUser();
    if (error) return error;
  
    const { ownerId, postTitle, postLink } = await req.json();
    if (!ownerId || !postTitle || !postLink) {
      return new Response('Missing required fields', { status: 400 });
    }
  
    const follows = await Follow.find({ followeeId: ownerId }).lean();
    if (!follows.length) {
      return new Response('No followers found', { status: 404 });
    }
  
    const followerIds = follows.map(f => f.followerId);
  
    const users = await User.find({ _id: { $in: followerIds }, newsletter: true }).select('email').lean();
    if (!users.length) {
      return new Response('No newsletter subscribers among followers', { status: 404 });
    }
  
    for (const user of users) {
      await sendMail({
        to: user.email,
        subject: 'New post from someone you follow',
        template: 'newPost',
        data: { postTitle, postLink },
      });
    }
  
    return new Response('Notifications sent', { status: 200 });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
