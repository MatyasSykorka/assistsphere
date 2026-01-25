"use server";

import { prisma } from "@/lib/prisma";

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId },
    });
}
