"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Profile from "@/models/profile";
import { revalidatePath } from "next/cache";

export type State = {
    message: string;
    error: string;
    success: boolean;
};

export async function saveProfile(prevState: State, formData: FormData): Promise<State> {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { error: "Not authenticated", success: false, message: "" };
        }

        const shopName = formData.get("shopName") as string;
        const bio = formData.get("bio") as string;

        if (!shopName || !bio) {
            return { error: "Shop Name and Bio are required", success: false, message: "" };
        }

        await dbConnect();

        const profile = await Profile.findOneAndUpdate(
            { sellerId: session.user.id },
            {
                sellerId: session.user.id,
                shopName,
                bio,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        revalidatePath("/seller");
        return { success: true, message: "Profile saved successfully!", error: "" };
    } catch (error: any) {
        console.error("Error saving profile:", error);
        return { error: error.message || "Failed to save profile", success: false, message: "" };
    }
}

export async function getProfile() {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return null;
        }

        await dbConnect();

        const profile = await Profile.findOne({ sellerId: session.user.id }).lean();

        if (!profile) {
            return null;
        }

        return {
            shopName: profile.shopName,
            bio: profile.bio,
        };
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        return null;
    }
}
