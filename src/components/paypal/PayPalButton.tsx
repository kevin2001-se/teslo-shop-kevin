"use client"

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { CreateOrderData, CreateOrderActions, OnApproveData, OnApproveActions } from "@paypal/paypal-js"
import { paypalCheckPayment, setTransactionId } from "@/actions";

interface Props {
    orderId: string;
    amount: number;
}

export const PayPalButton = ({ amount, orderId }: Props) => {

    const [{ isPending }] = usePayPalScriptReducer();

    const roundedAmount = (Math.round(amount * 100)) / 100; // Numero en 2 decimales

    if (isPending) {
        return ( // Esqueleton
            <div className="animate-pulse">
                <div className="h-11 bg-gray-300 rounded">

                </div>
                <div className="h-11 bg-gray-300 rounded mt-2">

                </div>
            </div>
        )
    }

    const createOrder = async (data: CreateOrderData, actions: CreateOrderActions): Promise<string> => { 

        const transactionId = await actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    invoice_id: orderId,
                    amount: {
                        value: `${roundedAmount}`,
                        currency_code: 'USD'
                    },

                }
            ]
        })

        // console.log({transactionId})
        // Guardar transactionId en la orden de la base de datos - setTransactionId
        const resupuesta = await setTransactionId(transactionId, orderId);

        if (!resupuesta.ok) {
            throw new Error(resupuesta.message);
        }

        return transactionId
    }

    const onApprove = async (data: OnApproveData, actions: OnApproveActions): Promise<void> => {

        const details = await actions.order?.capture();
        if (!details) return
        await paypalCheckPayment( details.id! )
    }

    return (
        <PayPalButtons 
            createOrder={createOrder}
            onApprove={ onApprove }
            className="relative z-0"
        />
    )
}
