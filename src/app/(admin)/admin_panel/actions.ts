'use server'

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return { ok: false as const, error: "Unauthorized: You must be logged in." };
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role_id: true },
    });

    if (!user || user.role_id !== 1) {
        return { ok: false as const, error: "Unauthorized: Only admins can make changes." };
    }

    return { ok: true as const, userId: session.user.id };
}

export async function createFloor(floorName: string) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.ok) return { success: false, error: authResult.error };

        const name = floorName.trim();
        if (!name) return { success: false, error: "Floor name must not be empty." };

        await prisma.floor.create({
            data: {
                floor_name: name,
            },
        });

        revalidatePath("/admin_panel");
        return { success: true };
    } catch (error) {
        console.error("Error creating floor:", error);
        return { success: false, error: "Failed to create floor." };
    }
}

export async function createRoomType(roomTypeName: string) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.ok) return { success: false, error: authResult.error };

        const name = roomTypeName.trim();
        if (!name) return { success: false, error: "Room type name must not be empty." };

        await prisma.room_type.create({
            data: {
                room_type_name: name,
            },
        });

        revalidatePath("/admin_panel");
        return { success: true };
    } catch (error) {
        console.error("Error creating room type:", error);
        return { success: false, error: "Failed to create room type." };
    }
}

export async function createRoom(input: { name: string; floorId: number; roomTypeId: number }) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.ok) return { success: false, error: authResult.error };

        const name = input.name.trim();
        if (!name) return { success: false, error: "Room name must not be empty." };
        if (!Number.isInteger(input.floorId)) return { success: false, error: "Select a valid floor." };
        if (!Number.isInteger(input.roomTypeId)) return { success: false, error: "Select a valid room type." };

        await prisma.room.create({
            data: {
                name,
                floor: input.floorId,
                room_type: input.roomTypeId,
            },
        });

        revalidatePath("/admin_panel");
        return { success: true };
    } catch (error) {
        // Prisma unique violation (room.name)
        if (typeof (error as { code?: unknown } | null)?.code === "string" && (error as { code: string }).code === "P2002") {
            return { success: false, error: "A room with this name already exists." };
        }
        console.error("Error creating room:", error);
        return { success: false, error: "Failed to create room." };
    }
}

export async function deleteRoom(roomId: number) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.ok) return { success: false, error: authResult.error };

        await prisma.room.delete({
            where: {
                room_id: roomId,
            },
        });

        revalidatePath("/admin_panel");
        return { success: true };
    } catch (error) {
        if (typeof (error as { code?: unknown } | null)?.code === "string" && (error as { code: string }).code === "P2003") {
            return { success: false, error: "Cannot delete room because it is used by existing tickets or relations." };
        }
        console.error("Error deleting room:", error);
        return { success: false, error: "Failed to delete room." };
    }
}

export async function deleteFloor(floorId: number) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.ok) return { success: false, error: authResult.error };

        await prisma.floor.delete({
            where: {
                floor_id: floorId,
            },
        });

        revalidatePath("/admin_panel");
        return { success: true };
    } catch (error) {
        if (typeof (error as { code?: unknown } | null)?.code === "string" && (error as { code: string }).code === "P2003") {
            return { success: false, error: "Cannot delete floor because it has rooms assigned to it." };
        }
        console.error("Error deleting floor:", error);
        return { success: false, error: "Failed to delete floor." };
    }
}

export async function deleteRoomType(roomTypeId: number) {
    try {
        const authResult = await requireAdmin();
        if (!authResult.ok) return { success: false, error: authResult.error };

        await prisma.room_type.delete({
            where: {
                room_type_id: roomTypeId,
            },
        });

        revalidatePath("/admin_panel");
        return { success: true };
    } catch (error) {
        if (typeof (error as { code?: unknown } | null)?.code === "string" && (error as { code: string }).code === "P2003") {
            return { success: false, error: "Cannot delete room type because it is used by existing rooms." };
        }
        console.error("Error deleting room type:", error);
        return { success: false, error: "Failed to delete room type." };
    }
}
