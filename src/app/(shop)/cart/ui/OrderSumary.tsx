'use client'

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const OrderSumary = () => {

    const [loaded, setLoaded] = useState(false)
    const { subTotal, tax, total, totalItem } = useCartStore(useShallow(state => state.getSumaryInformation()));

    useEffect(() => {
        setLoaded(true);
    }, [])


    if (!loaded) {
        return <p>Loading...</p>
    }
    
    return (
        <div className="grid grid-cols-2">

            <span>Nro. Productos</span>
            <span className="text-right">{ totalItem === 1 ? '1 artículo' : `${totalItem} artículos` }</span>

            <span>Subtotal</span>
            <span className="text-right">{ currencyFormat(subTotal) }</span>

            <span>Impuestos (18%)</span>
            <span className="text-right">{ currencyFormat(tax) }</span>

            <span className="mt-5 text-2xl">Total:</span>
            <span className="mt-5 text-2xl text-right">{ currencyFormat(total) }</span>

        </div>
    )
}
