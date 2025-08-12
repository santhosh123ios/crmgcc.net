import { executeQuery } from "../../utils/run_query.js";

export const updateUserStatus = (req, res) => {
    try {
        const { user_id, status } = req.body;

        // Validate required fields
        if (!user_id ) { //|| status === 0 || status === 1
            return res.status(400).json({
                success: false,
                message: "User ID and status are required"
            });
        }

        // Validate status values (assuming status can be active, inactive, suspended, etc.)
        const validStatuses = [0, 1];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed values: " + validStatuses.join(', ')
            });
        }

        const query = "UPDATE users SET status = ? WHERE id = ?";
        const data = [status, user_id];

        executeQuery({
            query,
            data,
            callback: (error, results) => {
                if (error) {
                    console.error("Database error:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Database error occurred"
                    });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "User status updated successfully",
                    data: {
                        user_id,
                        status,
                        updated_at: new Date()
                    }
                });
            }
        });

    } catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

