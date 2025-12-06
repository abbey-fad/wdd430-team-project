
import React from "react";
import { notFound } from "next/navigation";
import { getProductById, updateProduct } from "../../actions/product";
import ProductForm from "../../../components/ProductForm";
import Link from "next/link";
import { auth } from "@/auth";



export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    const session = await auth();
    let isOwner = false;

    if (session?.user?.id) {
        const Profile = (await import("@/models/profile")).default;
        const dbConnect = (await import("@/lib/db")).default;
        await dbConnect();

        const userProfile = await Profile.findOne({ sellerId: session.user.id }).lean();
        if (userProfile && product.profileId === userProfile._id.toString()) {
            isOwner = true;
        }
    }

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
            <Link href={isOwner ? "/seller" : "/"} style={{ display: "inline-block", marginBottom: "1rem" }}>
                &larr; {isOwner ? "Back to Profile" : "Back Home"}
            </Link>

            <div style={{ marginBottom: "3rem" }}>
                <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{product.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <span style={{
                        background: "#eee",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "15px",
                        fontSize: "0.9rem"
                    }}>
                        {product.category}
                    </span>
                    <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                        ${product.price ? product.price.toFixed(2) : "0.00"}
                    </span>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                    <p style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{product.description}</p>
                </div>

                {product.images && product.images.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                        {product.images.map((img: string, idx: number) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${product.name} - ${idx + 1}`}
                                style={{ width: "100%", borderRadius: "8px" }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isOwner && (
                <>
                    <hr style={{ margin: "3rem 0", borderTop: "1px solid #ddd" }} />

                    <div className="form-container" style={{ maxWidth: "100%" }}>
                        <h2 style={{ marginBottom: "1.5rem" }}>Edit Product</h2>
                        <ProductForm
                            action={updateProduct}
                            initialData={product}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
