export const revalidate = 60 // Cada 60 seg se revalidara la pagina

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    gender: Gender;
  }>,
  searchParams: Promise<{
    page: string;
  }>
}

// const products = initialData.products;

export default async function GenderPage({ params, searchParams }: Props) {

  const paramsUrl = await params;
  const gender = paramsUrl.gender;
  const searchQuery = await searchParams;
  const page = searchQuery.page ? parseInt(searchQuery.page) : 1;
  
  const { products, totalPages } = await getPaginatedProductsWithImages({ page, gender });
  
  if (products.length === 0) {
    redirect('/');
  }

  // if (id === 'kids') {
  //   notFound();
  // }

  const label: Record<Gender, string> = {
    "kid": 'para niños',
    "women": 'para mujeres',
    "men": 'para hombres',
    "unisex": 'para todos',
  }
  
  return (
      <>
        <Title 
          title="Tienda"
          subtitle={`Articulos de ${label[gender]}`}
          className="mb-2"
        />
        
        <ProductGrid 
          products={products}
        />
  
        <Pagination totalPages={totalPages} />
      </>
  );
}