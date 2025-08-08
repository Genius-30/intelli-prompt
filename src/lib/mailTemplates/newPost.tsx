import React from 'react';
import { Html } from '@react-email/html';

export default function NewPostEmail({ postTitle, postLink }: { postTitle: string; postLink: string }) {
  return (
    <Html>
      <h2>📢 Someone you follow posted!</h2>
      <p>{postTitle}</p>
      <a href={postLink}>Read more</a>
    </Html>
  );
}
