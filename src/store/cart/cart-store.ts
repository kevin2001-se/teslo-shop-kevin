import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];

    getTotalItems : () => number;
    getSumaryInformation: () => {
        subTotal: number;
        tax: number;
        total: number;
        totalItem: number;
    };

    addProductToCart: (product: CartProduct) => void
    updateProductQuantity: (product: CartProduct, quantity: number) => void
    deleteProductToCart: (product: CartProduct) => void

    clearCart: () => void
}

export const useCartStore = create<State>()(

    persist(// Almacena en localstorage
        (set, get) => ({
            cart: [],

            getTotalItems: () => {
                const { cart } = get();

                const totalItem = cart.reduce((total, item) => total + item.quantity ,0);

                return totalItem;
            },

            getSumaryInformation: () => {
                const { cart } = get();

                const subTotal = cart.reduce((subTotal,item) => subTotal + (item.price * item.quantity) , 0)
                const tax = subTotal * 0.18;
                const total = subTotal + tax;
                const totalItem = cart.reduce((total, item) => total + item.quantity ,0);

                return {
                    subTotal,
                    tax,
                    total,
                    totalItem
                }
            },

            addProductToCart(product: CartProduct) {
                const { cart } = get();

                // Revisar si el producto existe en el carrito con la talla seleccionada
                const productInCart = cart.some(
                    (item) => (item.id === product.id && item.sizes === product.sizes)
                );

                if (!productInCart) {
                    set({
                        cart: [...cart, product]
                    })
                    return;
                }

                // Se que el producto existe por talla
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.sizes === product.sizes) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    }

                    return item;
                })

                set({
                    cart: updatedCartProducts
                })

            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                // Se que el producto existe por talla
                const updatedCartProducts = cart.map((item) => {
                    if (item.id === product.id && item.sizes === product.sizes) {
                        return {
                            ...item,
                            quantity
                        }
                    }

                    return item;
                })

                set({
                    cart: updatedCartProducts
                })
            },
            deleteProductToCart: (product: CartProduct) => {
                const { cart } = get();

                const newCartProducts = cart.filter(item => item.id !== product.id || item.sizes !== product.sizes);

                set({
                    cart: newCartProducts
                })
            },
            clearCart: () => {
                set({cart: []})
            }
        }),
        {
            name: 'shopping-cart'
        }
    )
    
)