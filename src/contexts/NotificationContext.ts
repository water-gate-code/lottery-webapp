import { createContext, Dispatch } from "react";

// TODO: use nanoid from redux toolkit
let notificationIdFeed = 0;

export enum NotificationType {
  info = "info",
  warning = "warning",
  success = "success",
  danger = "danger",
}
interface Notification {
  id: number;
  type: NotificationType;
  title: string;
}
interface NotificationState {
  queue: Notification[];
}

export function createNotification(
  type: NotificationType,
  title: string
): Notification {
  // type = info|warning|success|danger
  return { id: notificationIdFeed++, type, title };
}

export const NOTIFICATION_ACTION_TYPES = {
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
};

export function notificationReducer(
  notification: NotificationState,
  action: { type: string; payload: Notification }
): NotificationState {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return {
        ...notification,
        queue: [...notification.queue, action.payload],
      };
    }
    case "REMOVE_NOTIFICATION": {
      const { queue } = notification;

      const index = queue.findIndex((n) => n.id === action.payload.id);
      queue.splice(index, 1);
      return {
        ...notification,
        queue: [...queue],
      };
    }
    default: {
      throw Error("Unknown notification action: " + action.type);
    }
  }
}

export const initialNotification: NotificationState = {
  queue: [],
};

export const NotificationContext = createContext(initialNotification);
export const NotificationDispatchContext = createContext<
  Dispatch<{
    type: string;
    payload: Notification;
  }>
>(() => {});
