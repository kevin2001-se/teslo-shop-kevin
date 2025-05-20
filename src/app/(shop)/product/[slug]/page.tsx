export const revalidate = 604800; // 7 Días

import { getProductBySlug } from "@/actions";
import { ProductMobileSlideShow, ProductSlideShow, StockLabel } from "@/components";
import { titleFont } from "@/config/fonts";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCart } from "./ui/AddToCart";

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const slug = (await params).slug
 
  const product = await getProductBySlug(slug);
 
  return {
    title: (product?.title ?? "Producto no encontrado"),
    description: product?.description ?? "",
    openGraph: {
      title: product?.title ?? "",
      description: product?.description ?? "",
      images: [`/products/${product?.images[1]}`]
    }
  }
}

export default async function ProductPage({ params }: Props) {

  const slug = (await params).slug;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">

        {/* Desktop */}
        <ProductSlideShow 
          title={product.title}
          images={product.images}
          className="hidden md:block"
        />
        {/* Movil */}
        <ProductMobileSlideShow 
          title={product.title}
          images={product.images}
          className="block md:hidden"
        />

      </div>

      {/* Details */}
      <div className="col-span-1 px-5">

        <StockLabel slug={product.slug} />
        
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">{product.price}</p>

        <AddToCart product={product} />

        {/* Descripcion */}
        <h3 className="font-bold text-sm">Descripción</h3>
        <p className="font-light">
          {product.description}
        </p>

      </div>

    </div>
  );
}