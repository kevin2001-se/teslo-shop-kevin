'use client'

import { logout } from "@/actions"
import { useUIStore } from "@/store"
import clsx from "clsx"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"
import Link from "next/link"
import { IoCloseOutline, IoLogInOutline, IoLogOutOutline, IoPeopleOutline, IoPersonOutline, IoSearchOutline, IoShirtOutline, IoTicketOutline } from "react-icons/io5"

export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeSideMenu = useUIStore(state => state.closeSideMenu);

    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;
    const isAdmin = session?.user.role === 'admin';

    const onLogout = async () => {
        await logout();
        await nextAuthSignOut({redirectTo: "/"});
    };
 
    return (
        <div>
            {/* Background */}
            {
                isSideMenuOpen && (
                    <div className='fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30'>

                    </div>
                )
            }
            {/* Blur */}
            {
                isSideMenuOpen && (
                    <div className='fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm' onClick={closeSideMenu}>

                    </div>
                )
            }

            {/* SideMenu */}
            {/* clsx, permite colocar codiciones en las clases de taildwind */}
            <nav className={
                clsx(
                    "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                    {
                        "translate-x-full": !isSideMenuOpen
                    }
                )
            }>
                <IoCloseOutline 
                    size={50}
                    className="absolute top-5 right-5 cursor-pointer"
                    onClick={closeSideMenu}
                />

                {/* Input de busqueda */}
                <div className="relative mt-14">
                    <IoSearchOutline size={20} className="absolute top-2 left-2" />
                    <input type="text" placeholder="Buscar" className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500" />
                </div>

                {
                    isAuthenticated && (
                        <>
                            {/* Menú */}
                            <Link href={'/profile'}
                                className="style-menu-item"
                                onClick={closeSideMenu}
                            >
                                <IoPersonOutline size={30} />
                                <span className="ml-3 text-xl">Perfil</span>
                            </Link>
                            <Link href={'/orders'}
                                className="style-menu-item"
                                onClick={closeSideMenu}
                            >
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-xl">Ordenes</span>
                            </Link>
                        </>
                    )
                }
                {
                    !isAuthenticated && (
                        <Link href={'/auth/login'}
                            className="style-menu-item"
                        >
                            <IoLogInOutline size={30} />
                            <span className="ml-3 text-xl">Ingresar</span>
                        </Link>
                    )
                }
                {
                    isAuthenticated && (
                        <Link href={'/'}
                            className="style-menu-item"
                            onClick={() => onLogout()}
                        >
                            <IoLogOutOutline size={30} />
                            <span className="ml-3 text-xl">Salir</span>
                        </Link>
                    )
                }

                {
                    isAuthenticated && isAdmin && (
                        <>
                            {/* Separetor */}
                            <div className="w-full h-px bg-gray-200 my-10" />

                            
                            <Link href={'/admin/products'}
                                className="style-menu-item"
                                onClick={closeSideMenu}
                            >
                                <IoShirtOutline size={30} />
                                <span className="ml-3 text-xl">Productos</span>
                            </Link>
                            <Link href={'/admin/orders'}
                                className="style-menu-item"
                                onClick={closeSideMenu}
                            >
                                <IoTicketOutline size={30} />
                                <span className="ml-3 text-xl">Ordenes</span>
                            </Link>
                            <Link href={'/admin/users'}
                                className="style-menu-item"
                                onClick={closeSideMenu}
                            >
                                <IoPeopleOutline size={30} />
                                <span className="ml-3 text-xl">Usuario</span>
                            </Link>
                        </>
                    )
                }
            </nav>

        </div>
    )
}
