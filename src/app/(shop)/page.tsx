export const revalidate = 60 // Cada 60 seg se revalidara la pagina

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    page: string;
  }>
}

export default async function HomePage({ searchParams }: Props) {

  const searchQuery = await searchParams;
  const page = searchQuery.page ? parseInt(searchQuery.page) : 1;

  const { products, totalPages } = await getPaginatedProductsWithImages({ page });

  if (products.length === 0) {
    redirect('/');
  }

  return (
    <>
      <Title 
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid 
        products={products}
      />

      <Pagination totalPages={totalPages} />
    </>
  );
}
