export default function ChangeQuantity({ sign, onClick }) {
    return (<span
        className="text-neutral-600 font-bold cursor-pointer text-base align-middle"
        onClick={onClick}
    >
        {sign}
    </span>)
}