import { FaPlus, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export default function getChangeQuantity({ updateQuantity }) {
  return [
    {
      icon: FaPlus,
      onClick: item => updateQuantity(item.id, item.quantity + 1),
    },
    {
      icon: FaMinus,
      onClick: item => updateQuantity(item.id, item.quantity - 1),
    },
    {
      icon: FaXmark,
      onClick: item => updateQuantity(item.id, 0),
    },
  ];
}
