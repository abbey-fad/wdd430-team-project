"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/app/actions/auth";
import Link from "next/link";
import FormInput from "../FormInput";

export default function LoginForm() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined
    );
    const searchParams = useSearchParams();
    const redirectTo =
        searchParams.get("redirectTo") ?? searchParams.get("callbackUrl") ?? undefined;

    return (
        <form action={dispatch}>
            <div>
                <h1>
                    Please log in.
                </h1>
                <div>
                    {redirectTo && (
                        <input type="hidden" name="redirectTo" value={redirectTo} />
                    )}
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        required
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        required
                        minLength={6}
                    />
                </div>
                <div
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <p>{errorMessage}</p>
                        </>
                    )}
                </div>
                <button
                    className="disabled:opacity-50"
                    aria-disabled={isPending}
                    disabled={isPending}
                >
                    Log in
                </button>
                <div>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </form>
    );
}
