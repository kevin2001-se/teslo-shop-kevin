'use server'

import { auth } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export const getOrderById = async(orderId: string) => {
    try {

        const session = await auth();

        if (!session) {
            return {
                ok: false,
                message: "Debe estar autenticado"
            }
        }
        
        // Obtener orden
        const order = await prisma.order.findUnique({
            where: {
                id: orderId
            },
            include: {
               OrderItem:  {
                include: {
                    product: {
                        select: {
                            ProductImage: {
                                select: {
                                    url: true
                                }
                            },
                            title: true,
                            slug: true
                        }
                    }
                }
               },
               OrderAddress: {
                include: {
                    country: {
                        select: {
                            name: true
                        }
                    }
                }
               }
            }
        })

        if ( !order ) {
            throw `${orderId} no existe`
        }

        if (session.user.role === 'role') {
            if (session.user.id !== order.id) {
                throw `${orderId} no es de ese usuario`
            }
        }

        const { OrderAddress, OrderItem, ...restOrder } = order;
        const { country, ...restAddress } = OrderAddress!;
        const items = OrderItem.map(item => {
            const { product, ...restItem } = item;

            return {
                ...restItem,
                image: product.ProductImage[0].url,
                titleProduct: product.title ,
                slug: product.slug
            }
        });

        return {
            ok: true,
            order: restOrder,
            address: {
                ...restAddress,
                country: country.name
            },
            products: items
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            message: "Hable con el administrador"
        }
    }
}