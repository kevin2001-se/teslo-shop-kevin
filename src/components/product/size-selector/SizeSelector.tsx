import { Size } from "@/interfaces"
import clsx from "clsx"

interface Props {
    selecterSize?: Size
    availableSizes: Size[]

    onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({ selecterSize, availableSizes, onSizeChanged }: Props) => {
  return (
    <div className="my-5">
        <h3 className="font-bold mb-4">Tallas disponibles</h3>

        <div className="flex">
            {
                availableSizes.map(size => (
                    <button className={
                        clsx(
                            "mx-2 hover:underline text-lg cursor-pointer",
                            {
                                'underline': size === selecterSize
                            }
                        )
                    } key={size} onClick={() => onSizeChanged(size)}>
                        {size}
                    </button>
                ))
            }
        </div>

    </div>
  )
}
