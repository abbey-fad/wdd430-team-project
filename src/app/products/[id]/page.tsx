import { notFound } from "next/navigation";
import { getProductById, updateProduct } from "../../actions/product";
import ProductForm from "../../../components/ProductForm";
import Link from "next/link";
import ReviewForm from "../../../components/ReviewForm";
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
            <Link href={isOwner ? "/seller" : `/seller/${product.profileId}`} style={{ display: "inline-block", marginBottom: "1rem" }}>
                &larr; {isOwner ? "Back to Profile" : "To Seller's Profile"}
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

            <hr style={{ margin: "3rem 0", borderTop: "1px solid #ddd" }} />

            <div style={{ marginBottom: "3rem" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>Reviews ({product.numReviews || 0})</h2>
                <div style={{ marginBottom: "1rem" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#f39c12" }}>
                        ★ {product.rating ? product.rating.toFixed(1) : "0.0"}
                    </span>
                    <span style={{ color: "#666", marginLeft: "0.5rem" }}>Average Rating</span>
                </div>

                {product.reviews && product.reviews.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {product.reviews.map((review: any, idx: number) => (
                            <div key={idx} style={{ padding: "1rem", border: "1px solid #eee", borderRadius: "8px", background: "#f9f9f9" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                    <strong>{review.name}</strong>
                                    <span style={{ color: "#f39c12" }}>
                                        {"★".repeat(review.rating)}
                                        {"☆".repeat(5 - review.rating)}
                                    </span>
                                </div>
                                <p style={{ margin: 0, color: "#333" }}>{review.comment}</p>
                                <small style={{ color: "#999", display: "block", marginTop: "0.5rem" }}>
                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                </small>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}

                <ReviewForm
                    productId={product._id}
                    currentUser={session?.user && session.user.id ? { id: session.user.id, name: session.user.name } : undefined}
                />
            </div>
        </div>
    );
}
