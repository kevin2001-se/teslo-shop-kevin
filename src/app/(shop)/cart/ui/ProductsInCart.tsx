
'use client'

import { ProductImage, QuantitySelector } from "@/components";
import { useCartStore } from "@/store"
import Link from "next/link";
import { useEffect, useState } from "react";

export const ProductsInCart = () => {

    const updateProductQuantity = useCartStore(state => state.updateProductQuantity);
    const deleteProductToCart = useCartStore(state => state.deleteProductToCart);
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
                        <ProductImage 
                            src={product.images} 
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
                            <Link className="hover:underline cursor-pointer" href={`/product/${product.slug}`}>{product.sizes} - {product.title}</Link>
                            <p>${product.price}</p>
                            <QuantitySelector 
                                quantity={product.quantity} 
                                onQuantityChanged={(quantity) => updateProductQuantity(product, quantity)}
                            />

                            <button className="underline mt-3 cursor-pointer" onClick={() => deleteProductToCart(product)}>Remover</button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
