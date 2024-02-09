const onClickOutside = (elementRef, callbackFunction) => {
  if (typeof document != "undefined") {
    document.addEventListener("click", (e) => {
      if (elementRef.current && !elementRef.current.contains(e.target))
        callbackFunction();
    });
  }
};
export default onClickOutside;
