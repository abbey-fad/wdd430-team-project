import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seller",
            required: true,
            unique: true,
        },
        shopName: {
            type: String,
            required: [true, "Please provide a shop name"],
            maxlength: [100, "Shop name cannot be more than 100 characters"],
        },
        bio: {
            type: String,
            required: [true, "Please provide a bio"],
            maxlength: [500, "Bio cannot be more than 500 characters"],
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    {
        timestamps: true,
        collection: "profiles",
    }
);

const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);

export default Profile;
