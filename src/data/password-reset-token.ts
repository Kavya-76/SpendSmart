import PasswordResetTokenModel from "@/models/PasswordResetToken";

// Function to get password reset token by token
export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await PasswordResetTokenModel.findOne({ token });
        return passwordResetToken;
    } catch (error) {
        console.error("Error fetching password reset token by token:", error);
        return null;
    }
}; 

// Function to get password reset token by email
export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await PasswordResetTokenModel.findOne({ email });
        return passwordResetToken;
    } catch (error) {
        console.error("Error fetching password reset token by email:", error);
        return null;
    }
};
