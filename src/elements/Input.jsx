import React, { useEffect, useRef, useState } from "react";
import DropMenu from "./Menu";
import QueryList from "./List";
import { getMenuOptions } from "../utils/data";
import {
  faChevronDown,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FilterInput = () => {
  const [queries, setQueries] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [currentInput, setCurrentInput] = useState({
    field: "",
    action: "",
    value: "",
  });
  const [stage, setStage] = useState("field");
  const [inputVal, setInputVal] = useState("");
  const [showDropMenu, setShowDropMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    setListItems(getMenuOptions(stage));
    setActiveIndex(-1);
  }, [stage]);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const resetInput = () => {
    setCurrentInput({ field: "", action: "", value: "" });
    setStage("field");
    setInputVal("");
    setShowDropMenu(true);
    focusInput();
  };

  const handleSelection = (selectedValue) => {
    if (!selectedValue) return;
    if (stage === "field") {
      setCurrentInput({
        field: selectedValue,
        action: "",
        value: "",
      });
      setStage("action");
    } else if (stage === "action") {
      setCurrentInput((prev) => ({ ...prev, action: selectedValue }));
      setStage("value");
      setShowDropMenu(false);
    }
    setInputVal("");
    focusInput();
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    if (stage === "value") {
      setCurrentInput((prev) => ({ ...prev, value }));
    } else {
      setInputVal(value);
      setShowDropMenu(true);
    }
  };

  const handleAddQuery = (e) => {
    e.preventDefault();
    if (e.key === "Enter" && stage === "value" && currentInput.value) {
      setQueries((prev) => [...prev, currentInput]);
      resetInput();
    }
  };

  const removeQuery = (index) => {
    setQueries((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (!showDropMenu) return;

    const { key } = e;

    if (key === "ArrowDown" || key === "ArrowUp") {
      const direction = key === "ArrowDown" ? 1 : -1;
      const nextIndex = (activeIndex + direction + listItems.length) % listItems.length;
      setActiveIndex(nextIndex);
      setInputVal(listItems[nextIndex]);
    } else if (key === "Enter" && stage !== "value") {
      handleSelection(listItems[activeIndex]);
    }
  };

  return (
    <>
      <div
        tabIndex={1}
        className="relative flex min-h-11 w-full flex-col gap-1 overflow-hidden rounded border-2 border-[#1f212c] bg-[#17181d] pr-6 text-sm shadow-lg md:flex-row md:items-center md:justify-center md:pr-10 md:text-base"
        onKeyDown={handleKeyDown}
      >
        <QueryList queries={queries} removeQuery={removeQuery} />
        <div className="flex flex-grow items-center py-2">
          <span className="ml-1 flex h-full items-center justify-center">
            {currentInput.field} {currentInput.action}
          </span>
          <input
            ref={inputRef}
            className="h-full flex-grow overflow-hidden bg-transparent px-3 outline-none placeholder:truncate placeholder:text-sm placeholder:text-[#3f4044]"
            placeholder={`${
              stage !== "value"
                ? 'Search Filter: select options from suggested values, for IN/NOT IN operators - press "Enter" after selecting options'
                : 'Type specific value and press "Enter" to form triplet'
            }`}
            type="text"
            value={stage !== "value" ? inputVal : currentInput.value}
            onClick={() => setShowDropMenu(true)}
            onChange={handleValueChange}
            onKeyUp={handleAddQuery}
            aria-label="Search filter"
          />
        </div>
        <FontAwesomeIcon
          onClick={() => setShowDropMenu(!showDropMenu && stage !== "value")}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-sm text-[#3f4044]"
          icon={showDropMenu ? faMagnifyingGlass : faChevronDown}
          aria-hidden="true"
        />
      </div>

      {showDropMenu && stage !== "value" && (
        <DropMenu
          activeIndex={activeIndex}
          listItems={listItems}
          stage={stage}
          onSelection={handleSelection}
          currentInput={currentInput}
        />
      )}
    </>
  );
};

export default FilterInput;
