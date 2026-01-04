'use server'

import { prisma } from "@/lib/prisma";

export async function updateUserRole(
    userId: number, 
    roleId: number
) {
    await prisma.user.update({
        where: { user_id: userId },
        data: { role_id: roleId },
    });
}
