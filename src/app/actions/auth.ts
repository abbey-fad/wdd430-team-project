"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Seller from "@/models/user";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { signIn, signOut } from "@/auth";

const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function register(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    let { name, email, password } = validatedFields.data;
    email = email.toLowerCase();

    try {
        await dbConnect();

        const existingUser = await Seller.findOne({ email });

        if (existingUser) {
            return {
                message: "User already exists",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await Seller.create({
            name,
            email,
            password: hashedPassword,
        });
    } catch (error) {
        return {
            message: "Database Error: Failed to Create User.",
        };
    }

    revalidatePath("/login");
    redirect("/login");
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    try {
        if (!formData.get("redirectTo")) {
            formData.set("redirectTo", "/seller");
        }
        await signIn("credentials", formData);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("CredentialsSignin")) {
                return "Invalid credentials.";
            }
            throw error;
        }
        throw error;
    }
}

export async function logout() {
    await signOut({ redirectTo: "/" });
    revalidatePath("/");
}
