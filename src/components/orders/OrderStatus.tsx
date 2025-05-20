import clsx from 'clsx'
import { IoCardOutline } from 'react-icons/io5'

interface Props {
    isPaid: boolean;
}

export const OrderStatus = ({ isPaid }: Props) => {

    const textPagado = !isPaid ? 'Pendiente de pago' : 'Pagada' ;

    return (
        <div className={
            clsx("flex items-center rounded-lg py-2 px-3.5 font-bold text-white mb-5", {
            'bg-red-500': !isPaid,
            'bg-green-700': isPaid
            })
        }>
            <IoCardOutline size={30} />
            <span className="mx-2">{textPagado}</span>
        </div>
    )
}
