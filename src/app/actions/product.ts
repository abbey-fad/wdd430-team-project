"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/product";
import Profile from "@/models/profile";
import { revalidatePath } from "next/cache";

export type State = {
    message: string;
    error: string;
    success: boolean;
};

export async function saveProduct(prevState: State, formData: FormData): Promise<State> {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { error: "Not authenticated", success: false, message: "" };
        }

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;

        const images = formData.getAll("images") as string[];

        const validImages = images.filter(img => img && img.trim() !== "");

        if (!name || !description || !price || !category) {
            return { error: "Name, Description, Price, and Category are required", success: false, message: "" };
        }

        if (validImages.length === 0) {
            return { error: "At least one image URL is required", success: false, message: "" };
        }

        await dbConnect();

        const profile = await Profile.findOne({ sellerId: session.user.id });
        if (!profile) {
            return { error: "Seller profile not found", success: false, message: "" };
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            category,
            images: validImages,
            profileId: profile._id,
        });

        await Profile.findByIdAndUpdate(
            profile._id,
            { $push: { products: newProduct._id } },
            { new: true }
        );

        revalidatePath("/seller");

        return { success: true, message: "Product created successfully!", error: "" };
    } catch (error: any) {
        console.error("Error saving product:", error);
        return { error: error.message || "Failed to save product", success: false, message: "" };
    }
}

export async function getProductById(id: string) {
    try {
        await dbConnect();
        const product = await Product.findById(id).lean();

        if (!product) {
            return null;
        }

        return {
            _id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            images: product.images || [],
            profileId: product.profileId.toString(),
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}


export async function getAllProducts() {
    try {
        await dbConnect();
        const products = await Product.find({}).sort({ createdAt: -1 }).lean();

        return products.map(product => ({
            _id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            images: product.images || [],
            profileId: product.profileId.toString(),
        }));
    } catch (error) {
        console.error("Error fetching all products:", error);
        return [];
    }
}

export async function updateProduct(prevState: State, formData: FormData): Promise<State> {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.id) {
            return { error: "Not authenticated", success: false, message: "" };
        }

        const productId = formData.get("id") as string;
        if (!productId) {
            return { error: "Product ID is missing", success: false, message: "" };
        }

        await dbConnect();

        const profile = await Profile.findOne({ sellerId: session.user.id });
        if (!profile) {
            return { error: "Seller profile not found", success: false, message: "" };
        }

        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return { error: "Product not found", success: false, message: "" };
        }

        if (existingProduct.profileId.toString() !== profile._id.toString()) {
            return { error: "Unauthorized to update this product", success: false, message: "" };
        }

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const price = Number(formData.get("price"));
        const category = formData.get("category") as string;
        const images = formData.getAll("images") as string[];
        const validImages = images.filter(img => img && img.trim() !== "");

        if (!name || !description || !price || !category) {
            return { error: "Name, Description, Price, and Category are required", success: false, message: "" };
        }

        if (validImages.length === 0) {
            return { error: "At least one image URL is required", success: false, message: "" };
        }

        existingProduct.name = name;
        existingProduct.description = description;
        existingProduct.price = price;
        existingProduct.category = category;
        existingProduct.images = validImages;

        await existingProduct.save();

        revalidatePath("/seller");
        revalidatePath(`/products/${productId}`);

        return { success: true, message: "Product updated successfully!", error: "" };
    } catch (error: any) {
        console.error("Error updating product:", error);
        return { error: error.message || "Failed to update product", success: false, message: "" };
    }
}
