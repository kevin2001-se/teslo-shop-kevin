'use client'

import { placeOrder } from "@/actions"
import { useAddressStore, useCartStore } from "@/store"
import { currencyFormat } from "@/utils"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useShallow } from "zustand/shallow"

export const PlaceOrder = () => {

    const router = useRouter();

    const [loaded, setLoaded] = useState(false)
    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const address = useAddressStore(state => state.address);
    const { subTotal, tax, total, totalItem } = useCartStore(useShallow(state => state.getSumaryInformation()));
    const cart = useCartStore(state => state.cart);
    const clearCart = useCartStore(state => state.clearCart)

    useEffect(() => {
        setLoaded(true)
    }, [])

    const onPlaceOrder = async () => {
      setIsPlacingOrder(true)

      const productsToOrder = cart.map(product => ({
        productId: product.id,
        quantity: product.quantity,
        size: product.sizes
      }));

      const respuesta = await placeOrder(productsToOrder, address);
      
      if (!respuesta.ok) {
        setIsPlacingOrder(false)
        setErrorMessage(respuesta.message!);
        return;
      }

      // Todo salio bien
      clearCart();
      router.replace('/orders/' + respuesta.order?.id);
    }

    if (!loaded) {
        return <p>Cargando..</p>
    }

    return (
        <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entraga</h2>
            <div className="mb-10">
              <p className="text-xl">{ address.firstName } {address.lastName}</p>
              <p className="font-bold">{ address.address }</p>
              <p>{ address.city }</p>
              <p>{ address.country }</p>
              <p>{ address.postalCode }</p>
              <p>{ address.phone }</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
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

            <div className="mt-5 w-full">
              <p className="mb-5">
                <span className="text-xs">
                  Al hacer click en &quot;Colocar orden&quot;, aceptas nuestros <a href="#" className="underline">términos y condiciones </a> y <a href="#" className="underline">politica de privacidad</a>
                </span>
              </p>

              <p className="text-red-500">{errorMessage}</p>

              <button className={
                clsx("w-full", {
                  'btn-primary': !isPlacingOrder,
                  'btn-disabled': isPlacingOrder
              })
              }
            //   href={'/orders/123'}
                onClick={onPlaceOrder}
              >
                Colocar orden
              </button>
            </div>

        </div>
    )
}
