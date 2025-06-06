'use client'

import { login, registerUser } from "@/actions"
import clsx from "clsx"
import Link from "next/link"
import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'

type FormInputs = {
  name: string
  email: string
  password: string
}

export const RegisterForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>() ;
    const [errorMessage, setErrorMessage] = useState("")

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        const { name, email, password } = data;

        // Server action
        const respuesta = await registerUser(name, email, password)
    
        if (!respuesta.ok) {
            setErrorMessage(respuesta.message!)
            return;
        }

        await login(email.toLowerCase(), password)
        
        window.location.replace('/')

    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>

            <label htmlFor="nombre">Nombre completo</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.name
                        }
                    )
                }
                type="text" 
                autoFocus
                {...register('name', { required: true })}
            />

            <label htmlFor="email">Correo electrónico</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.email
                        }
                    )
                }
                type="email" 
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />


            <label htmlFor="password">Contraseña</label>
            <input
                className={
                    clsx(
                        "px-5 py-2 border bg-gray-200 rounded mb-5",
                        {
                            'border-red-500': !!errors.password
                        }
                    )
                }
                type="password" 
                {...register('password', { required: true, minLength: 6 })}
            />

            <span className="text-red-500">{ errorMessage }</span>

            <button
                
                className="btn-primary">
                Crear cuenta
            </button>


            {/* divisor l ine */ }
            <div className="flex items-center my-5">
                <div className="flex-1 border-t border-gray-500"></div>
                <div className="px-2 text-gray-800">O</div>
                <div className="flex-1 border-t border-gray-500"></div>
            </div>

            <Link
                href="/auth/login" 
                className="btn-secondary text-center">
                Ingresar
            </Link>

        </form>
    )
}
