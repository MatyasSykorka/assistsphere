"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Definice rozhraní pro vstupní data z formuláře
interface CreateTicketInput {
    title: string;
    roomId: number;
    categoryId: number;
    priorityId: number;
    description: string;
}

export async function createTicket(data: CreateTicketInput) {
    try {
        // 1. Získání ID přihlášeného uživatele (Příklad pro Better-Auth)
        // V reálném nasazení zde použijte metodu vaší knihovny pro získání session
        // Např: const session = await auth.api.getSession();
        const reportedUserId = "user_placeholder_id"; // Zde musí být String ID uživatele 

        // 2. Vytvoření záznamu v tabulce 'description' 
        const newDescription = await prisma.description.create({
        data: {
            description: data.description,
        },
        });

        // 3. Vytvoření samotného ticketu 
        const newTicket = await prisma.ticket.create({
            data: {
                ticket_title: data.title,
                reported_user: reportedUserId, // String 
                room: data.roomId,
                category: data.categoryId,
                description: newDescription.description_id, // Propojení s ID z kroku 2 
                priority: data.priorityId,
                status: 1, // Default hodnota pro 'Open' 
            },
        });

        // Pročištění cache, aby se změny projevily
        revalidatePath("/report");

        return { success: true, ticketId: newTicket.ticket_id };
    } catch (error) {
        console.error("Chyba při vytváření ticketu:", error);
        return { success: false, error: "Nepodařilo se odeslat ticket." };
    }
}