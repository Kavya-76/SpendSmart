import VerificationTokenModel from "@/models/VerificationToken";

// Function to get verification token by token
export const getVerificationTokenByToken = async (token: string) => {
    try {
        const verificationToken = await VerificationTokenModel.findOne({ token });
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by token:", error);
        return null;
    }
};

// Function to get verification token by email
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await VerificationTokenModel.findOne({ email });
        return verificationToken;
    } catch (error) {
        console.error("Error fetching verification token by email:", error);
        return null;
    }
};
