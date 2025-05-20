
export const generatePagination = ( currentPage: number, totalPages: number ) => {

    // Si el numero totoal de paginas es 7 o menos
    // vamos a mostrar todas la páginas sin puntos suspensivos
    if (totalPages <= 7) {
        return Array.from({length: totalPages}, (_, i) => i + 1); // [1,2,3,4,5,6,7]
    }

    // Si la pagina actual esta entre las primeras tres páginas
    // mostrar las primeras 3 , puntos suspensivos y las ultimas 2

    if (currentPage <= 3) {
        return [1,2,3, '...', totalPages - 1, totalPages];
    }

    // Si la pagina actual esta entre las ultimas 3 páginas
    // mostrar las primeras 2, putnos suspensivps, las utlimas 3 páginas
    if (currentPage >= totalPages - 2) {
        return [1,2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // SI la página actual está en otro lugar medio
    // mostrar la primera página, puntos suspensivos, página actual y vecinos
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ]
}