"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth"; // Importujte vaši instanci Better-Auth
import { headers } from "next/headers";

// Rozhraní pro vstupní data funkce createTicket
export interface CreateTicketInput {
    title: string;
    description: string;
    roomId: string;
    categoryId: string;
    priorityId: number;
}

export async function createTicket(data: CreateTicketInput) {
    try {
        // 1. Získání skutečné session přihlášeného uživatele
        const session = await auth.api.getSession({
            headers: await headers() 
        });

        if (!session || !session.user) {
            return { 
                success: false, 
                error: "Musíte být přihlášeni." 
            };
        }

        const reportedUserId = session.user.id; // Skutečné ID z databáze

        // 2. Vytvoření záznamu v tabulce 'description' 
        const newDescription = await prisma.description.create({
            data: {
                description: data.description,
            },
        });

        // 3. Vytvoření samotného ticketu s platným ID uživatele
        const newTicket = await prisma.ticket.create({
            data: {
                ticket_title: data.title,
                reported_user: reportedUserId,
                room: data.roomId,
                category: data.categoryId,
                description: newDescription.description_id,
                priority: data.priorityId,
                status: 1, 
            },
        });

        revalidatePath("/my_tickets");
        return { 
            success: true, 
            ticketId: newTicket.ticket_id 
        };
    } catch (error) {
        console.error("Chyba při vytváření ticketu:", error);
        return { 
            success: false, 
            error: "Nepodařilo se odeslat ticket." 
        };
    }
}