'use client';

import Chat from './dashboard';
import { useEffect } from 'react';
import { useAuth } from '@/utils/Auth';

export default function Page() {
  return (
    <section>
      <Chat />
    </section>
  );
}
