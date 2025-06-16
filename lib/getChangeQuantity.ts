import { FaPlus, FaMinus } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { CartItem } from "../types/types";
import { UpdateQuantityFn } from "../types/types";

interface GetChangeQuantityArgs {
  updateQuantity: UpdateQuantityFn;
}

interface ChangeAction {
  icon: React.ComponentType;
  onClick: (item: CartItem) => void;
}

export default function getChangeQuantity({
  updateQuantity,
}: GetChangeQuantityArgs): ChangeAction[] {
  return [
    {
      icon: FaPlus,
      onClick: (item: CartItem) => updateQuantity(item.id, item.quantity + 1),
    },
    {
      icon: FaMinus,
      onClick: (item: CartItem) => updateQuantity(item.id, item.quantity - 1),
    },
    {
      icon: FaXmark,
      onClick: (item: CartItem) => updateQuantity(item.id, 0),
    },
  ];
}
