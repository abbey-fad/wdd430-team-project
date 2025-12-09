"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Profile from "@/models/profile";
import Product from "@/models/product";
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

export async function getProfile(profileId?: string) {
    try {
        const session = await auth();
        await dbConnect();

        let query = {};
        if (profileId) {
            query = { _id: profileId };
        } else {
            if (!session || !session.user || !session.user.id) {
                return null;
            }
            query = { sellerId: session.user.id };
        }

        const profile = await Profile.findOne(query)
            .populate({
                path: 'products',
                model: Product,
                options: { sort: { createdAt: -1 } }
            })
            .lean();

        if (!profile) {
            return null;
        }

        const products = (profile.products || []).map((p: any) => ({
            _id: p._id.toString(),
            name: p.name,
            price: p.price,
            category: p.category,
            images: p.images || [],
            profileId: p.profileId.toString(),
            rating: p.rating || 0,
            numReviews: p.numReviews || 0
        }));

        const currentUserId = session?.user?.id;
        const isOwner = currentUserId && profile.sellerId.toString() === currentUserId;

        return {
            _id: profile._id.toString(),
            sellerId: profile.sellerId.toString(),
            shopName: profile.shopName,
            bio: profile.bio,
            products: products,
            isOwner: !!isOwner
        };
    } catch (error: any) {
        console.error("Error fetching profile:", error);
        return null;
    }
}
