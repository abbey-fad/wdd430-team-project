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
            reviews: product.reviews?.map((review: any) => ({
                ...review,
                _id: review._id.toString(),
                userId: review.userId ? review.userId.toString() : undefined,
                createdAt: review.createdAt?.toISOString(),
                updatedAt: review.updatedAt?.toISOString(),
            })) || [],
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
        };
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}


export async function getAllProducts(query?: string) {
    try {
        await dbConnect();

        // If query exists, filter products by name or description (case-insensitive)
        const filter = query
            ? {
                  $or: [
                      { name: { $regex: query, $options: "i" } },
                      { description: { $regex: query, $options: "i" } },
                  ],
              }
            : {};

        const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

        return products.map(product => ({
            _id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            images: product.images || [],
            profileId: product.profileId.toString(),
            rating: product.rating || 0,
            numReviews: product.numReviews || 0,
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

export async function createReview(prevState: State, formData: FormData): Promise<State> {
    try {
        const productId = formData.get("productId") as string;
        const rating = Number(formData.get("rating"));
        const comment = formData.get("comment") as string;

        if (!productId || !rating || !comment) {
            return { error: "Please provide a rating and comment", success: false, message: "" };
        }

        await dbConnect();

        const product = await Product.findById(productId);
        if (!product) {
            return { error: "Product not found", success: false, message: "" };
        }

        const session = await auth();
        let name = formData.get("name") as string;
        let userId = undefined;

        if (session?.user) {
            name = session.user.name || "Anonymous User";
            userId = session.user.id;
        } else if (!name) {
            return { error: "Please provide your name", success: false, message: "" };
        }

        const review = {
            userId,
            name,
            rating,
            comment,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc: number, item: { rating: number }) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        revalidatePath(`/products/${productId}`);

        return { success: true, message: "Review added successfully!", error: "" };
    } catch (error: any) {
        console.error("Error creating review:", error);
        return { error: error.message || "Failed to add review", success: false, message: "" };
    }
}
