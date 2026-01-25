'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function assignTicket(
    ticketId: number
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user) {
            return { success: false, error: "Unauthorized: You must be logged in." };
        }

        const userId = session.user.id;

        // Fetch user to check role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role_id: true },
        });

        // Check if user is Admin (1) or Manager (2).
        if (
            !user || 
            ( user.role_id !== 1 && user.role_id !== 2 )
        ) {
            return { success: false, error: "Unauthorized: Only managers or admins can assign tickets." };
        }

        await prisma.ticket.update({
            where: { ticket_id: ticketId },
            data: {
                processing_user: userId,
                status: 2, // Set status to 'In Progress'
                updated_status: new Date(),
            },
        });

        revalidatePath("/tickets");
        return { success: true };
    } 
    catch (error) {
        console.error("Error assigning ticket:", error);
        return { success: false, error: "Failed to assign ticket." };
    }
}

export async function unassignTicket(ticketId: number) {
    try {
        await prisma.ticket.update({
            where: { ticket_id: ticketId },
            data: {
                processing_user: null,
                status: 1, // Reset to 'Open'
                updated_status: new Date(),
            },
        });
        revalidatePath("/tickets");
        return { success: true };
    } 
    catch (error) {
        console.error("Error unassigning ticket:", error);
        return { 
            success: false, 
            error: "Failed to unassign ticket." 
        };
    }
}

export async function updateTicketStatus(
    ticketId: number, 
    statusId: number
) {
    try {
        await prisma.ticket.update({
            where: { ticket_id: ticketId },
            data: {
                status: statusId,
                updated_status: new Date(),
            },
        });
        revalidatePath("/tickets");
        return { success: true };
    } 
    catch (error) {
        console.error("Error updating ticket status:", error);
        return { 
            success: false, 
            error: "Failed to update status." 
        };
    }
}

export async function updateTicketAdminComment(
    ticketId: number,
    adminComment: string
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized: You must be logged in." };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role_id: true },
        });

        if (!user || (user.role_id !== 1 && user.role_id !== 2)) {
            return { success: false, error: "Unauthorized: Only managers or admins can write comments." };
        }

        const normalized = typeof adminComment === "string" ? adminComment.trim() : "";

        await prisma.$transaction(async (tx) => {
            const ticket = await tx.ticket.findUnique({
                where: { ticket_id: ticketId },
                select: { adminOrManagerCommentId: true },
            });

            if (!ticket) {
                throw new Error(`Ticket ${ticketId} not found`);
            }

            if (!normalized.length) {
                if (ticket.adminOrManagerCommentId) {
                    const commentId = ticket.adminOrManagerCommentId;
                    await tx.ticket.update({
                        where: { ticket_id: ticketId },
                        data: { adminOrManagerCommentId: null },
                    });
                    await tx.adminOrManagerComment.delete({
                        where: { id: commentId },
                    });
                }
                return;
            }

            if (ticket.adminOrManagerCommentId) {
                await tx.adminOrManagerComment.update({
                    where: { id: ticket.adminOrManagerCommentId },
                    data: { text: normalized },
                });
                return;
            }

            const created = await tx.adminOrManagerComment.create({
                data: { text: normalized },
                select: { id: true },
            });

            await tx.ticket.update({
                where: { ticket_id: ticketId },
                data: { adminOrManagerCommentId: created.id },
            });
        });

        revalidatePath("/tickets");
        revalidatePath("/my_tickets");

        return { success: true };
    } catch (error) {
        console.error("Error updating admin comment:", error);
        return { success: false, error: "Failed to update admin comment." };
    }
}