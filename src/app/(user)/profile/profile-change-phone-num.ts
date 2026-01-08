"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function updatePhoneNumber(phoneNumber: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        throw new Error("Unauthorized");
    }

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            // Save as null if the string is empty
            phone_number: phoneNumber || null,
        },
    });

    revalidatePath("/profile");
}
