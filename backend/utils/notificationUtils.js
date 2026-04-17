const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

/**
 * Send notifications to a dynamic list of recipients
 * @param {Array} recipients - Array of userId to notify
 * @param {Object} data - Notification data (title, message, type, relatedId, link)
 */
const sendBulkNotifications = async (recipients, data) => {
    try {
        if (!recipients || recipients.length === 0) return;

        const notifications = recipients.map(userId => ({
            recipient: userId,
            ...data
        }));

        await Notification.insertMany(notifications);
        console.log(`[NOTIFY] ${notifications.length} notifications created for type: ${data.type}`);
    } catch (error) {
        console.error('Error in sendBulkNotifications:', error);
    }
};

module.exports = {
    sendBulkNotifications,
};
