import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        userImage: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

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
        reviews: [ReviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
