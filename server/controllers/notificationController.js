import notificationModel from "../models/notificationModel.js";

// Get notifications for the logged-in user
// Get notifications for the logged-in user
export const getUserNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Base query: Notifications for this user or broadcast
        const query = {
            $or: [{ to: { $in: [userId] } }, { to: { $size: 0 } }],
        };

        // Get paginated notifications
        const notifications = await notificationModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count of notifications
        const total = await notificationModel.countDocuments(query);

        // Get count of UNREAD notifications for badge
        const unreadCount = await notificationModel.countDocuments({
            ...query,
            readBy: { $ne: userId },
        });

        res.status(200).send({
            success: true,
            total,
            unreadCount,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
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
