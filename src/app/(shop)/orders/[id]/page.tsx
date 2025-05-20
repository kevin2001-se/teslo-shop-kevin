import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>
}

export default async function OrderPage({ params }: Props) {

  const id = (await params).id;
  
  if (!id) {
    notFound();
  }

  const order = await getOrderById(id);

  // Verificar 
  if (!order?.ok) {
    notFound();
  }

  const { order: orderHead, address, products } = order;

  const { ...orderDetails } = orderHead!;

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      
      <div className="flex flex-col w-[1000px]">

        <Title title={`Orden #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">

            <OrderStatus isPaid={orderDetails.isPaid} />

            {/* Items */}
            {
              products!.map(product => (
                <div key={product.slug + product.size} className="flex mb-5">
                  <Image 
                    src={`/products/${product.image}`} 
                    width={100} 
                    height={100} 
                    alt={product.titleProduct} 
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                    className="mr-5 rounded"
                  />

                  <div>
                    <p>{product.size} - {product.titleProduct}</p>
                    <p>{currencyFormat(product.price)} x {product.quantity}</p>
                    <p className="font-bold">Subtotal: {currencyFormat(product.price * product.quantity)}</p>
                  </div>
                </div>
              ))
            }
          </div>

          {/* Checkout */}
          <div className="bg-white rounded-xl shadow-xl p-7">

            <h2 className="text-2xl mb-2">Dirección de entraga</h2>
            <div className="mb-10">
              <p className="text-xl">{ address!.firstName } {address!.lastName}</p>
              <p className="font-bold">{ address!.address }</p>
              <p>{ address!.city }</p>
              <p>{ address!.country }</p>
              <p>{ address!.postalCode }</p>
              <p>{ address!.phone }</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10"></div>

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">

              <span>Nro. Productos</span>
              <span className="text-right">{ orderDetails.itemsInOrder === 1 ? '1 artículo' : `${orderDetails.itemsInOrder} artículos` }</span>
              
              <span>Subtotal</span>
              <span className="text-right">{ currencyFormat(orderDetails.subTotal) }</span>

              <span>Impuestos (18%)</span>
              <span className="text-right">{ currencyFormat(orderDetails.tax) }</span>

              <span className="mt-5 text-2xl">Total:</span>
              <span className="mt-5 text-2xl text-right">{ currencyFormat(orderDetails.total) }</span>

            </div>

            <div className="mt-5 w-full">
              {
                orderDetails.isPaid ? (
                  <OrderStatus isPaid={orderDetails.isPaid} />
                ) : (
                  <PayPalButton amount={orderDetails.total} orderId={orderDetails.id} />
                )
              }
            </div>

          </div>

        </div>
        
      </div>

    </div>
  );
}