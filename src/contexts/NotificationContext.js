import { createContext } from "react";

export const NotificationContext = createContext(null);
export const NotificationDispatchContext = createContext(null);

let notificationIdFeed = 0;

export const NotificationType = {
  info: "info",
  warning: "warning",
  success: "success",
  danger: "danger",
};

export function createNotification(type, title) {
  // type = info|warning|success|danger
  return { id: notificationIdFeed++, type, title };
}

export const NOTIFICATION_ACTION_TYPES = {
  ADD_NOTIFICATION: "ADD_NOTIFICATION",
  REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
};

export function notificationReducer(notification, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      return {
        ...notification,
        queue: [...notification.queue, action.notification],
      };
    }
    case "REMOVE_NOTIFICATION": {
      const { queue } = notification;

      const index = queue.findIndex((n) => n.id === action.id);
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

export const initialNotification = {
  queue: [],
};
