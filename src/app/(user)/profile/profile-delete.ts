"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteAccount() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.user.delete({
            where: {
                id: session.user.id,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, error: "Failed to delete account. You may have active tickets or other dependencies preventing deletion." };
    }
}