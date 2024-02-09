import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import arrowIcon from "@/assests/images/arrow.svg";
import Image from "next/image";
import onClickOutside from "@/utils/functions/onClickOutside";
import TextInput from "../TextInput";

const CustomSelect = forwardRef(
  ({ title, data, isMultiSelect = false }, _ref) => {
    const [openModal, setOpenModal] = useState(false);
    const [searchPhrase, setSearchPhrase] = useState("");
    const [selectedItems, setSelectedItems] = useState([]);
    const [itemsList, setItemsList] = useState(data);
    const selectRef = useRef(null);
    const openModalHandler = () => {
      setOpenModal(true);


      //we search and select items , and when we  open the modal again without search the selected items must be on top 
      const _sortedItemList = [...itemsList];
      selectedItems.forEach((selectedItem) => {
        const indexOfSelectedItem = _sortedItemList.findIndex(
          (_item) => _item.value === selectedItem.value
        );
        _sortedItemList.splice(indexOfSelectedItem, 1);
        _sortedItemList.unshift(selectedItem);
      });
      setItemsList(_sortedItemList);
    };

    onClickOutside(selectRef, () => {
      setOpenModal(false);
      setSearchPhrase("");
    });

    const selectHandler = (selectedItem, event) => {
      if (isMultiSelect) {
        // is Multi Select
        if (!event.target.checked) {
          // input unChecked so we delete it from Selected Items
          setSelectedItems((e) => {
            const _items = [...e];
            const _index = e.findIndex(
              (_item) => _item.value === selectedItem.value
            );
            _index > -1 && _items.splice(_index, 1);
            return _items;
          });
          // moving the item to the data index
          if (!searchPhrase) {
            const sortedIndex = data.findIndex(
              (element) => element.value === selectedItem.value
            );
            const selectedIndex = itemsList.findIndex(
              (_item) => _item.value === selectedItem.value
            );
            setItemsList((e) => {
              const _list = [...e];
              _list.splice(selectedIndex, 1);
              _list.splice(sortedIndex, 0, selectedItem);
              return _list;
            });
          }
        } else {
          // input just Selected
          setSelectedItems((e) => [...e, selectedItem]);
          // move the selected Item to the start
          const indexOfSelectedItem = itemsList.findIndex(
            (_item) => _item.value === selectedItem.value
          );
          setItemsList((e) => {
            const _list = [...e];
            _list.splice(indexOfSelectedItem, 1);
            _list.unshift(selectedItem);
            return _list;
          });
        }
      } else {
        // just a single Select
        setSelectedItems([selectedItem]);
        setOpenModal(false);
      }
    };

    useEffect(() => {
      setItemsList(data);
    }, [data]);

    useEffect(() => {
      // limit the items to search\
      const filteredList = data.filter((element) => {
        return element.label
          .toLowerCase()
          .replace(/ /g, "")
          .includes(searchPhrase?.toLowerCase().replace(/ /g, ""));
      });
      setItemsList(filteredList);
    }, [searchPhrase]);

    useImperativeHandle(_ref, () => ({
      getSelectedItems: () => {
        return selectedItems;
      },
    }));

    return (
      <div className="relative cursor-pointer" ref={selectRef}>
        {/* select container  */}
        <div
          onClick={openModalHandler}
          className={`border select-none border-slate-400 rounded-full relative cursor-pointer py-1 px-3  w-full flex justify-between ${
            selectedItems.length > 1 ? "bg-sky-900 text-white" : "text-black"
          }`}
        >
          <span className="font-medium truncate">
            {selectedItems.length == 1 ? selectedItems[0]?.label : title}
          </span>

          <div className="flex items-center">
            {selectedItems.length > 1 && (
              <div className="w-6 h-6 flex items-center  justify-center text-sky-900 bg-white rounded-full">
                {selectedItems.length}
              </div>
            )}
            <Image
              className={`w-3 ml-3 font-bold  ${
                openModal ? "-rotate-90" : "rotate-90"
              } ${selectedItems.length > 1 ? "invert" : ""} `}
              priority
              src={arrowIcon}
              alt="arrow key"
            />
          </div>
        </div>

        {/* select Modal */}
        {openModal && (
          <div className="absolute z-20 bg-white p-3 border rounded-lg shadow-slate-400 max-h-80 overflow-y-auto shadow-md top-[103%] min-w-full left-2">
            <TextInput
              className={"mb-3"}
              value={searchPhrase}
              setValue={setSearchPhrase}
              placeholder={`Search ${title}`}
            />
            {itemsList?.length > 0 ? (
              itemsList.map((item) => (
                <div key={item.value} className="my-1">
                  {isMultiSelect ? (
                    <div className="flex items-center justify-start">
                      <input
                        checked={selectedItems.find(
                          (_item) => _item.value == item.value
                        ) || false}
                        className="mr-2"
                        type="checkbox"
                        name={item.value}
                        id={item.value}
                        onChange={selectHandler.bind(this, item)}
                      />
                      <label className="text-nowrap" htmlFor={item.value}>
                        {item.label}
                      </label>
                    </div>
                  ) : (
                    <div onClick={selectHandler.bind(this, item)}>
                      {item.label}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>loading...</div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export default memo(CustomSelect);
