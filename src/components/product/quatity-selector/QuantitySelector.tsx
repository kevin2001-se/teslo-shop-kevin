'use client'
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
    quantity: number;
    onQuantityChanged: (quantity: number) => void
}

export const QuantitySelector = ({quantity, onQuantityChanged}: Props) => {

    const onValueChange = (value: number) => {
        if (quantity + value < 1) return;
        
        onQuantityChanged(quantity + value);
    }

    return (
        <div className="flex">
            <button onClick={() => onValueChange(-1)} className="cursor-pointer">
                <IoRemoveCircleOutline size={30} />
            </button>
            <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
                {quantity}
            </span>
            <button onClick={() => onValueChange(+1)} className="cursor-pointer">
                <IoAddCircleOutline size={30} />
            </button>
        </div>
    )
}
