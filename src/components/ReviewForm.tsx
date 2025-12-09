"use client";

import { useActionState, useEffect, useState, useRef } from "react";
import { createReview, State } from "@/app/actions/product";

interface ReviewFormProps {
    productId: string;
    currentUser: {
        id?: string;
        name?: string | null;
    } | undefined;
}

const initialState: State = {
    message: "",
    error: "",
    success: false,
};

export default function ReviewForm({ productId, currentUser }: ReviewFormProps) {
    const [state, formAction, isPending] = useActionState(createReview, initialState);
    const [rating, setRating] = useState(5);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            setRating(5);
        }
    }, [state]);

    return (
        <div style={{ marginTop: "2rem", border: "1px solid #ddd", padding: "1.5rem", borderRadius: "8px" }}>
            <h3>Write a Review</h3>
            {state.error && <p style={{ color: "red" }}>{state.error}</p>}
            {state.success && <p style={{ color: "green" }}>{state.message}</p>}

            {!state.success && (
                <form ref={formRef} action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input type="hidden" name="productId" value={productId} />

                    {!currentUser && (
                        <div>
                            <label style={{ display: "block", marginBottom: "0.5rem" }}>Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                            />
                        </div>
                    )}

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Rating</label>
                        <select
                            name="rating"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Good</option>
                            <option value="2">2 - Fair</option>
                            <option value="1">1 - Poor</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: "0.5rem" }}>Comment</label>
                        <textarea
                            name="comment"
                            required
                            rows={4}
                            style={{ width: "100%", padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className={isPending ? "loading" : ""}
                    >
                        {isPending ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}
        </div>
    );
}
