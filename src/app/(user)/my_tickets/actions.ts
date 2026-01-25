"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateMyTicket(formData: FormData) {
    const ticketIdRaw = formData.get("ticketId");
    const titleRaw = formData.get("title");
    const descriptionIdRaw = formData.get("descriptionId");
    const descriptionRaw = formData.get("description");
    const roomIdRaw = formData.get("roomId");
    const categoryIdRaw = formData.get("categoryId");
    const priorityIdRaw = formData.get("priorityId");

    const ticketId = typeof ticketIdRaw === "string" ? Number(ticketIdRaw) : NaN;
    const descriptionId = typeof descriptionIdRaw === "string" ? Number(descriptionIdRaw) : NaN;
    const roomId = typeof roomIdRaw === "string" ? Number(roomIdRaw) : NaN;
    const categoryId = typeof categoryIdRaw === "string" ? Number(categoryIdRaw) : NaN;
    const priorityId = typeof priorityIdRaw === "string" ? Number(priorityIdRaw) : NaN;
    const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
    const description = typeof descriptionRaw === "string" ? descriptionRaw.trim() : "";

    if (!Number.isFinite(ticketId) || !Number.isFinite(descriptionId)) {
        throw new Error("Invalid ticket id");
    }

    if (!Number.isFinite(roomId) || !Number.isFinite(categoryId) || !Number.isFinite(priorityId)) {
        throw new Error("Invalid ticket fields");
    }

    if (!title) {
        throw new Error("Title is required");
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
        select: { reported_user: true, description: true },
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (ticket.reported_user !== session.user.id) {
        throw new Error("Not allowed");
    }

    if (ticket.description !== descriptionId) {
        throw new Error("Invalid description reference");
    }

    const [room, category, priority] = await Promise.all([
        prisma.room.findUnique({ where: { room_id: roomId }, select: { room_id: true } }),
        prisma.category.findUnique({ where: { category_id: categoryId }, select: { category_id: true } }),
        prisma.priority.findUnique({ where: { priority_id: priorityId }, select: { priority_id: true } }),
    ]);

    if (!room || !category || !priority) {
        throw new Error("Invalid room/category/priority");
    }

    await prisma.$transaction([
        prisma.ticket.update({
            where: { ticket_id: ticketId },
            data: {
                ticket_title: title,
                room: roomId,
                category: categoryId,
                priority: priorityId,
            },
        }),
        prisma.description.update({
            where: { description_id: descriptionId },
            data: { description },
        }),
    ]);

    revalidatePath("/my_tickets");
}

export async function deleteMyTicket(ticketId: number) {
    if (!Number.isFinite(ticketId)) {
        throw new Error("Invalid ticket id");
    }

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Not authenticated");
    }

    const ticket = await prisma.ticket.findUnique({
        where: { ticket_id: ticketId },
        select: {
            reported_user: true,
            description: true,
            ticket_attachment: true,
        },
    });

    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (ticket.reported_user !== session.user.id) {
        throw new Error("Not allowed");
    }

    await prisma.ticket.delete({
        where: { ticket_id: ticketId },
    });

    const descriptionId = ticket.description;
    const attachmentId = ticket.ticket_attachment;

    const [descCount, attachmentCount] = await Promise.all([
        prisma.ticket.count({ where: { description: descriptionId } }),
        attachmentId ? prisma.ticket.count({ where: { ticket_attachment: attachmentId } }) : Promise.resolve(0),
    ]);

    if (descCount === 0) {
        await prisma.description.delete({
            where: { description_id: descriptionId },
        });
    }

    if (attachmentId && attachmentCount === 0) {
        await prisma.ticket_attachment.delete({
            where: { attachment_id: attachmentId },
        });
    }

    revalidatePath("/my_tickets");
}
