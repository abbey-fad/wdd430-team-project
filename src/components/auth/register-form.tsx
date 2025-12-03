"use client";

import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import Link from "next/link";
import FormInput from "../FormInput";

export default function RegisterForm() {
    const [state, dispatch, isPending] = useActionState(register, undefined);

    return (
        <form action={dispatch}>
            <div>
                <h1>
                    Create an account.
                </h1>
                <div className="w-full">
                    <FormInput
                        label="Name"
                        type="text"
                        name="name"
                        id="name"
                        placeholder="Enter your name"
                        required
                        error={state?.errors?.name?.[0]}
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        required
                        error={state?.errors?.email?.[0]}
                    />
                    <FormInput
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter password"
                        required
                        minLength={6}
                        error={state?.errors?.password?.[0]}
                    />
                </div>
                <div
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {state?.message && (
                        <>
                            <p>{state.message}</p>
                        </>
                    )}
                </div>
                <button
                    className="disabled:opacity-50"
                    aria-disabled={isPending}
                    disabled={isPending}
                >
                    Sign up
                </button>
                <div>
                    Already have an account?{" "}
                    <Link href="/login" className="hover:underline">
                        Log in
                    </Link>
                </div>
            </div>
        </form>
    );
}
