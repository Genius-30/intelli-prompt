import { Resend } from 'resend';
import NewPostEmail from './mailTemplates/newPost'
import AnnouncementEmail from './mailTemplates/announce';

const resend = new Resend(process.env.RESEND_API_KEY);

// Map templates to components
const templates = {
  newPost: NewPostEmail,
  announcement: AnnouncementEmail,
};

interface SendMailProps {
  to: string | string[];
  subject: string;
  template: keyof typeof templates;
  data?: Record<string, any>;
}

export async function sendMail({ to, subject, template, data = {} }: SendMailProps) {
  const EmailComponent = templates[template];
  if (!EmailComponent) throw new Error(`Template "${template}" not found`);

  try {
    const response = await resend.emails.send({
      from: 'IntelliPrompt <updates@intelliprompt.com>',
      to,
      subject,
      react: EmailComponent(data),
    });

    return { success: true, response };
  } catch (error) {
    return { success: false, error };
  }
}
