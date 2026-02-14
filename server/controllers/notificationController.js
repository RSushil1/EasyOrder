import notificationModel from "../models/notificationModel.js";

// Get notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find notifications where:
        // 1. 'to' array includes userId OR 'to' array is empty (broadcast)
        // 2. userId is NOT in 'readBy' array (unread)
        const notifications = await notificationModel
            .find({
                $and: [
                    {
                        $or: [{ to: { $in: [userId] } }, { to: { $size: 0 } }],
                    },
                    { readBy: { $ne: userId } },
                ],
            })
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            total: notifications.length,
            notifications,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching notifications",
            error,
        });
    }
};

// Mark a single notification as read
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        await notificationModel.findByIdAndUpdate(id, {
            $addToSet: { readBy: userId },
        });

        res.status(200).send({
            success: true,
            message: "Notification marked as read",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error marking notification as read",
            error,
        });
    }
};

// Mark all notifications as read
export const markAllRead = async (req, res) => {
    try {
        const userId = req.user._id;

        // Update all notifications that are for this user (or broadcast) and not yet read by them
        await notificationModel.updateMany(
            {
                $and: [
                    {
                        $or: [{ to: { $in: [userId] } }, { to: { $size: 0 } }],
                    },
                    { readBy: { $ne: userId } },
                ],
            },
            {
                $addToSet: { readBy: userId },
            }
        );

        res.status(200).send({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error marking all read",
            error,
        });
    }
};
