import { store } from "./store";
import {
  NotificationType,
  clearNotify,
  newNotification,
  notify,
} from "./store/slices/app";

function errorEventParser(errorEvent: any) {
  const message =
    errorEvent.reason?.data?.message ||
    errorEvent.reason?.message ||
    errorEvent.message;
  return { message };
}

export function errorHandler(errorEvent: any) {
  // event.preventDefault(); // This will not print the error in the console });

  const { message } = errorEventParser(errorEvent);
  if (message) {
    const notification = newNotification(NotificationType.danger, message);
    store.dispatch(notify(notification));
    setTimeout(() => store.dispatch(clearNotify(notification)), 3000);
  }
}
