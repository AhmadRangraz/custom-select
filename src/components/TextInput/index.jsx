import React from "react";

const TextInput = ({value , setValue , placeholder , className , ...refs}) =>{
    const changeHandler = (event) =>{
        setValue(event.target.value)
    }
    return (
      <input
        placeholder={placeholder}
        value={value}
        onChange={changeHandler}
        className={`px-3 py-1 border rounded-lg border-slate-600 w-full  ${className}`}
        type="text"
        {...refs}
      />
    );
}

export default TextInput