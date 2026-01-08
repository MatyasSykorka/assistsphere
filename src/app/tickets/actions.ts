'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignTicket(ticketId: number, userId: string) {
  try {
    // Fetch user to check role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role_id: true },
    });

    // Check if user is Admin (1) or Manager (2). Adjust IDs as per your 'role' table.
    // Default role is 3 (User).
    if (!user || (user.role_id !== 1 && user.role_id !== 2)) {
      return { success: false, error: "Unauthorized: Only managers or admins can assign tickets." };
    }

    await prisma.ticket.update({
      where: { ticket_id: ticketId },
      data: {
        processing_user: userId,
        status: 2, // Assuming 2 is 'In Progress' or 'Assigned'
        updated_status: new Date(),
      },
    });

    revalidatePath("/tickets");
    return { success: true };
  } catch (error) {
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

export async function updateTicketStatus(ticketId: number, statusId: number) {
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
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { 
      success: false, 
      error: "Failed to update status." 
    };
  }
}