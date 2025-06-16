import type { ReactElement } from "react";
import type { ChangeQuantitySpan, ChangeQuantitySpansProps } from "../../types/types";

export default function ChangeQuantitySpans({ cqs, item }: ChangeQuantitySpansProps): ReactElement {
  return (
    <>
      {cqs.map((cq, i) => (
        <span
          key={i}
          className="cursor-pointer text-base"
          onClick={() => cq.onClick(item)}
        >
          <cq.icon className="fill-neutral-600 duration-300 hover:opacity-50" size={15} />
        </span>
      ))}
    </>
  );
}