import { Worker } from 'bullmq';
import { redis } from '@/lib/redis';
import { sendMail } from '@/lib/sendMail.ts';

new Worker('emailQueue', async (job) => {
    if (job.name === 'notifyFollowers') {
      const { user, postTitle, postLink } = job.data;

      await sendMail({
        to: user.email,
        subject: 'New post from someone you follow',
        template: 'newPost',
        data: { postTitle, postLink },
      });
    } else if (job.name === 'announcement') {
      const { user, message } = job.data; 

      await sendMail({
        to: user.email,
        subject: 'New announcement',
        template: 'announcement',
        data: { message },
      });
    }
  },
  { connection: redis }
);
