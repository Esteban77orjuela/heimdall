import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NotificationService } from '../src/services/notificationService';

let Notifications: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Notifications = require('expo-notifications');
} catch {
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    NotificationService.requestPermissions();

    if (!Notifications) return;

    const subscription = Notifications.addNotificationReceivedListener((notification: any) => {
      const alarmId = notification.request.content.data?.alarmId;
      if (alarmId) {
        router.push({ pathname: '/alarm-overlay', params: { alarmId } });
      }
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
      const alarmId = response.notification.request.content.data?.alarmId;
      if (alarmId) {
        router.push({ pathname: '/alarm-overlay', params: { alarmId } });
      }
    });

    return () => {
      subscription?.remove();
      responseSubscription?.remove();
    };
  }, [router]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="create-alarm"
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen
          name="alarm-overlay"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
