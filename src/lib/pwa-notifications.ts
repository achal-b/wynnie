interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export class PWANotifications {
  static async requestPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
      throw new Error("This browser does not support notifications");
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  static async showNotification(
    title: string,
    options: NotificationOptions & { actions?: NotificationAction[] } = {}
  ): Promise<void> {
    const permission = await this.requestPermission();

    if (permission === "granted") {
      // If service worker is available, use it for notifications
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, {
          icon: "/web-app-manifest-192x192.png",
          badge: "/web-app-manifest-192x192.png",
          ...options,
        });
      } else {
        // Fallback to regular notification (without actions)
        const { actions, ...notificationOptions } = options;
        new Notification(title, {
          icon: "/web-app-manifest-192x192.png",
          ...notificationOptions,
        });
      }
    }
  }

  static async scheduleOrderReminder(orderDetails: {
    orderId: string;
    deliveryTime: Date;
  }): Promise<void> {
    const now = new Date();
    const deliveryTime = new Date(orderDetails.deliveryTime);
    const reminderTime = new Date(deliveryTime.getTime() - 30 * 60 * 1000); // 30 minutes before

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();

      setTimeout(() => {
        this.showNotification("Wynnie Order Reminder", {
          body: `Your order #${orderDetails.orderId} will be delivered in 30 minutes!`,
          tag: `order-${orderDetails.orderId}`,
          requireInteraction: true,
          actions: [
            {
              action: "track",
              title: "Track Order",
            },
            {
              action: "close",
              title: "Dismiss",
            },
          ],
        });
      }, timeUntilReminder);
    }
  }

  static async showDeliveryNotification(orderDetails: {
    orderId: string;
    status: string;
  }): Promise<void> {
    let title = "Order Update";
    let body = `Your order #${orderDetails.orderId} status has been updated to ${orderDetails.status}`;

    switch (orderDetails.status.toLowerCase()) {
      case "out_for_delivery":
        title = "Order Out for Delivery";
        body = `Your order #${orderDetails.orderId} is now out for delivery!`;
        break;
      case "delivered":
        title = "Order Delivered";
        body = `Your order #${orderDetails.orderId} has been delivered. Enjoy your shopping!`;
        break;
      case "ready_for_pickup":
        title = "Order Ready for Pickup";
        body = `Your order #${orderDetails.orderId} is ready for pickup at your selected location.`;
        break;
    }

    await this.showNotification(title, {
      body,
      tag: `delivery-${orderDetails.orderId}`,
      requireInteraction: true,
      actions: [
        {
          action: "view",
          title: "View Order",
        },
      ],
    });
  }
}
