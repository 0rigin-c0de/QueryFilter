import { useEffect, useRef } from "react";

const DropMenu = ({
  activeIndex,
  listItems,
  stage,
  onSelection,
  currentInput,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.scrollIntoView({
      block: "center",
    });
  }, [activeIndex]);

  return (
    <div className="z-10 mt-2 w-full flex flex-col justify-start gap-1 overflow-y-auto overflow-x-hidden rounded bg-[#121317] p-1">
      {listItems.map((item, index) => (
        <div
          key={index}
          ref={index === activeIndex ? containerRef : null}
          onClick={() => onSelection(item)}
          className={`flex h-10 w-full cursor-pointer items-center rounded px-3 active:bg-[#434650] ${
            index === activeIndex ? "bg-[#434650]" : ""
          }`}
          role="button"
          tabIndex={0}
          aria-label={item}
        >
          {stage === "action" && `${currentInput?.field} `}
          {item}
        </div>
      ))}
    </div>
  );
};

export default DropMenu;
