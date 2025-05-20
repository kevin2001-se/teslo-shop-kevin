'use server'

import { PayPalOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (transactionId: string) => {
    
    const authToken = await getPayPalBearToken();

    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo obtener el token de verificación.'
        }
    }

    const resp = await verifyPayPalPatment(transactionId, authToken); 

    if (!resp) {
        return {
            ok: false,
            message: 'Error al verificar el pago.'
        }
    }

    const { status, purchase_units } = resp;
    const { invoice_id: orderId } = purchase_units[0]; //TODO invoice ID
    
    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'Aún no se ha pagado en paypal'
        }
    }

    // TODO: Realizar la actualización en la bd
    try {
        console.log({ status, purchase_units })

        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        })

        // TODO: Revalidar un path
        revalidatePath(`/orders/${orderId}`)
        
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: '500 - El pago no se pudo realizar'
        }
    }
}

const getPayPalBearToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const OAUTH_URL = process.env.PAYPAL_OAUTH_URL ?? "";

    const base64Token = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
        'utf-8'
    ).toString('base64')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", `Basic ${base64Token}`);

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
    };

    try {

        const resolve = await fetch(OAUTH_URL, {
            ...requestOptions,
            cache: 'no-store' // Evita usar el cache y revalida el fetch
        }).then((response) => response.json());
        return resolve.access_token
        
    } catch (error) {
        console.log(error)
        return null
    }
}

const verifyPayPalPatment = async ( paypalTransactionId: string, bearerToken: string ): Promise<PayPalOrderStatusResponse | null> => {

    const PAYPAL_URL = process.env.PAYPAL_ORDERS_URL ?? "";

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };
    try {
        const resolve = await fetch(`${PAYPAL_URL}/${paypalTransactionId}`, {
            ...requestOptions,
            cache: 'no-store' // Evita usar el cache y revalida el fetch
        }).then((response) => response.json())

        return resolve;
    } catch (error) {
        console.log(error)
        return null;
    }
}