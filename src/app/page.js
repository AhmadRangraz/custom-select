"use client";

import CustomSelect from "@/components/CustomSelect";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  // I didn't use Axios cause the main purpose is to create the Component
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const selectRef = useRef();
  const callAPI = async () => {
    try {
      const res = await fetch(`https://api.coinpaprika.com/v1/coins`);
      const data = await res.json();
      // now slice the data and sort by name
      const sortedAndSlicedData = data
        .slice(0, 200)
        .map((item) => ({ label: item.name, value: item.id }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setFetchedData(sortedAndSlicedData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callAPI();
    return () => {
      setFetchedData([]);
    };
  }, []);

  const getSelectedItemsHandler = () => {
    setSelectedItems(selectRef.current?.getSelectedItems());
  };

  return (
    <main className=" w-full flex min-h-screen flex-col items-center  p-24">
      <div className=" w-44">
        <CustomSelect
          ref={selectRef}
          data={fetchedData}
          title={"coins"}
          isMultiSelect
        />
        <p className="my-2">
          i did this so the parent don't get reRender everytime we change the
          select , but we have updated data.
        </p>
        <button
          className="border p-2 border-black text-blue-900 font-medium m-4 shadow-sm rounded-lg"
          onClick={getSelectedItemsHandler}
        >
          get the Data from Select
        </button>
        <div className="flex flex-col ">
          {selectedItems.map((items) => (
            <span className="" key={items.value}>
              {items.label}
            </span>
          ))}
        </div>
      </div>

      <div className="w-60 my-2">
        <CustomSelect
          data={fetchedData}
          title={"Single coin"}
        />
      </div>
    </main>
  );
}
