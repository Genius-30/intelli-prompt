import React from 'react';
import { Html } from '@react-email/html';

export default function AnnouncementEmail({ message }: { message: string }) {
  return (
    <Html>
      <h2>🚀 IntelliPrompt Update</h2>
      <p>{message}</p>
    </Html>
  );
}
