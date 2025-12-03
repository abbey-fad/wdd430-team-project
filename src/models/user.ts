import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [60, "Name cannot be more than 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please provide a valid email",
            ],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "seller", "admin"],
            default: "seller",
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: "sellers"
    }
);

const Seller = mongoose.models.Seller || mongoose.model("Seller", SellerSchema);

export default Seller;
