'use server'
import { prisma } from "@/lib/prisma";

export const setTransactionId = async (transactionId: string, orderId: string) => {
    try {
        
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                transactionId: transactionId
            }
        })

        return {
            ok: true
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "No se pudo actualizar la orden"
        }
    }
}