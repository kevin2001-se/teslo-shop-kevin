'use server'

import { auth } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import { prisma } from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
    try {

        const session = await auth();
        const userId = session?.user.id;

        // Verificar sesión de usuario
        if (!userId) {
            return {
                ok: false,
                message: 'No hay sesión de usuario'
            }
        }

        // Obtener la información de los productos
        // Podemos llevar 2 productos con el mismo ID
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds.map(p => p.productId)
                }
            }
        })

        // Calcular los montos

        const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
        
        // Totales de tax, subtotal y total
        const { subtotal, tax, total } = productIds.reduce((totals, item) => {

            const productQuantity = item.quantity;
            const product = products.find(product => product.id === item.productId);

            if (!product) throw new Error(`${item.productId} no existe - 500`);

            const subTotal = product.price * productQuantity;
            
            totals.subtotal += subTotal;
            totals.tax += subTotal * 0.18;
            totals.total += subTotal * 1.18;

            return totals;
        }, {subtotal: 0, tax: 0, total: 0})

        try {
            const prismaTX = await prisma.$transaction(async (tx) => {

                // 1. Actualizar el stock de los productos
                const updatedProductsPromises = products.map(async (product) => {

                    // Acumular valores
                    const productQuantity = productIds.filter(
                        p => p.productId === product.id
                    ).reduce((acc, item) => acc + item.quantity , 0);

                    if (productQuantity === 0) {
                        throw new Error(`${product.id} no tiene cantidad definida`);
                    }

                    return tx.product.update({
                        where: {
                            id: product.id
                        },
                        data: {
                            // inStock: product.inStock - productQuantity // No hacer
                            inStock: {
                                decrement: productQuantity // Decrement: se basa en el valor actual del producto
                            }
                        }
                    })
                })

                const updatedProducts = await Promise.all(updatedProductsPromises);

                // Verficar valores negativos en la existencia = no hay stock
                updatedProducts.forEach(product => {
                    if (product.inStock < 0) {
                        throw new Error(`${product.title} no tiene inventario suficiente`);
                    }
                })

                // 2. Crear la orden - Encabezado - Detalles
                const order = await tx.order.create({
                    data: {
                        userId: userId,
                        itemsInOrder: itemsInOrder,
                        subTotal: subtotal,
                        tax: tax,
                        total: total,

                        OrderItem: {
                            createMany: {
                                data: productIds.map(p => ({
                                    quantity: p.quantity,
                                    size: p.size,
                                    price: products.find(product => product.id === p.productId)?.price ?? 0,
                                    productId: p.productId
                                }))
                            }
                        }
                    }
                })
                // Validar si el price es 0 mandar una error


                // 3. Crear la dirección de la orden
                const orderAddress = await tx.orderAddress.create({
                    data: {
                        firstName: address.firstName,
                        lastName: address.lastName,
                        address: address.address,
                        address2: address.address2,
                        postalCode: address.postalCode,
                        city: address.city,
                        phone: address.phone,
                        countryId: address.country,
                        orderId: order.id
                    }
                })

                return {
                    order,
                    orderAddress,
                    updatedProducts
                }

            })

            return {
                ok: true,
                order: prismaTX.order,
                prismaTX
            }
        } catch (error: unknown) {
            console.log(error)
            let message = 'Error';

            if (error instanceof Error) {
                message = error.message;
            }

            return {
                ok: false,
                message: message
            }
        }
        
    } catch (error) {
        console.log(error)
        return {
            ok: false,
            message: ""
        }
    }
}