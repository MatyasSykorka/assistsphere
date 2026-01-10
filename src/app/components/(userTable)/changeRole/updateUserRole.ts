'use server'

import { prisma } from "@/lib/prisma";

export async function updateUserRole(
    userId: string, 
    roleId: number
) {
    await prisma.user.update({
        where: { id: userId },
        data: { role_id: roleId },
    });
}
