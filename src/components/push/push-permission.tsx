'use client';

import { useState, useEffect } from 'react';
import { BellIcon, BellSlashIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PushPermission() {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  async function subscribe() {
    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        toast.error('Notifications refusées');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      });

      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      });

      if (!res.ok) {
        toast.error("Erreur lors de l'activation");
      }
    } catch (error) {
      console.error('Push subscription error:', error);
      toast.error("Erreur lors de l'activation des notifications");
    } finally {
      setLoading(false);
    }
  }

  if (permission === 'unsupported') return null;

  if (permission === 'granted') {
    return (
      <Button variant="ghost" size="icon" className="text-emerald-400" disabled title="Notifications activées">
        <BellIcon className="w-5 h-5" weight="fill" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-slate-400 hover:text-white"
      onClick={subscribe}
      disabled={loading}
      title="Activer les notifications"
    >
      <BellSlashIcon className="w-5 h-5" />
    </Button>
  );
}
