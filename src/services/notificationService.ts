import { Alarm, DayOfWeek } from "../domain/entities/alarm";

let Notifications: any = null;
try {
  Notifications = require('expo-notifications'); // eslint-disable-line @typescript-eslint/no-require-imports
} catch {
}

Notifications?.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DAY_TO_NUMBER: Record<DayOfWeek, number> = {
  D: 1, L: 2, M: 3, X: 4, J: 5, V: 6, S: 7,
};

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (!Notifications) return false;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  },

  async scheduleAlarm(alarm: Alarm): Promise<void> {
    if (!Notifications) return;
    await this.cancelAlarm(alarm.id);
    if (!alarm.isActive) return;

    const [hoursStr, minutesStr] = alarm.time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (alarm.period === "PM" && hours !== 12) hours += 12;
    if (alarm.period === "AM" && hours === 12) hours = 0;

    const hasNotes = alarm.notes && alarm.notes.length > 0;
    const body = hasNotes
      ? `Tienes ${alarm.notes.length} nota(s) pendientes.`
      : "Es hora!";

    if (alarm.days.length === 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.title,
          body,
          sound: true,
          data: { alarmId: alarm.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: hours,
          minute: minutes,
        },
        identifier: `${alarm.id}-single`,
      });
    } else {
      for (const day of alarm.days) {
        const weekday = DAY_TO_NUMBER[day];
        await Notifications.scheduleNotificationAsync({
          content: {
            title: alarm.title,
            body,
            sound: true,
            data: { alarmId: alarm.id },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            weekday,
            hour: hours,
            minute: minutes,
          },
          identifier: `${alarm.id}-${day}`,
        });
      }
    }
  },

  async scheduleSnooze(alarm: Alarm, minutes: number = 5): Promise<void> {
    if (!Notifications) return;
    await this.cancelAlarm(alarm.id);

    const now = new Date();
    const snoozeDate = new Date(now.getTime() + minutes * 60000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.title + " (Pospuesta)",
        body: `Sonando en ${minutes} min`,
        sound: true,
        data: { alarmId: alarm.id, isSnooze: true },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: snoozeDate,
      },
      identifier: `${alarm.id}-snooze`,
    });
  },

  async cancelAlarm(alarmId: string): Promise<void> {
    if (!Notifications) return;
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.identifier.startsWith(alarmId)) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  },
};
