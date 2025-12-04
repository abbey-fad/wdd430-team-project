import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a product name"],
            maxlength: [100, "Name cannot be more than 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Please provide a product description"],
            maxlength: [1000, "Description cannot be more than 1000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Please provide a product price"],
            min: [0, "Price cannot be negative"],
        },
        category: {
            type: String,
            required: [true, "Please provide a product category"],
        },
        images: {
            type: [String],
            required: [true, "Please provide at least one image"],
        },
        profileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
