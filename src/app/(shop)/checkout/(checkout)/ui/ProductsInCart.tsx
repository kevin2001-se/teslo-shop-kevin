'use client'

import { useCartStore } from "@/store"
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {

    const [loaded, setLoaded] = useState(false)
    const productsInCart = useCartStore(state => state.cart);

    useEffect(() => {
        setLoaded(true)
    }, [])

    if (!loaded) {
        return <p>
            Loading...
        </p>
    }

    return (
        <>
            {
                productsInCart.map(product => (
                    <div key={`${product.slug}-${product.sizes}`} className="flex mb-5">
                        <Image 
                            src={`/products/${product.images}`} 
                            width={100} 
                            height={100} 
                            alt={product.title} 
                            style={{
                            width: '100px',
                            height: '100px'
                            }}
                            className="mr-5 rounded"
                        />

                        <div>
                            <span>{product.sizes} - {product.title} ({product.quantity})</span>
                            <p className="font-bold">{currencyFormat(product.price * product.quantity)}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
