"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    phone_number?: string | null;
    role_id?: number | null;
};

export async function createUser(input: CreateUserInput) {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!name) {
        throw new Error("Name is required");
    }

    if (!email) {
        throw new Error("Email is required");
    }

    if (!password || typeof password !== "string") {
        throw new Error("Password is required");
    }

    const requestHeaders = await headers();

    const session = await auth.api.getSession({
        headers: requestHeaders,
    });

    const currentUserId = session?.user?.id;
    if (!currentUserId) {
        throw new Error("Unauthorized");
    }

    const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role_id: true },
    });

    if ((currentUser?.role_id ?? 3) !== 1) {
        throw new Error("Forbidden");
    }

    const roleId = input.role_id ?? 3;

    await auth.api.signUpEmail({
        headers: requestHeaders,
        body: {
            name,
            email,
            password,
            role_id: roleId,
            phone_number: input.phone_number?.trim() || undefined,
        },
    });
}
