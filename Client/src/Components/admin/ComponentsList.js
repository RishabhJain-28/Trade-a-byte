import React from "react";

function ComponentsList({ list, increment, decrement, cart, setCart }) {
  const handleChange = () => {};
  const getValue = (_id, qty) => {
    let val;
    if (!cart[_id]) val = 0;
    else val = cart[_id];
    return qty ? `${val}/${qty}` : `${val}`;
  };
  return (
    <div>
      {list.map(({ comp, _id, qty }) => (
        <div className="control-row" key={_id}>
          <button className="component-list">{comp.name}</button>
          <div className="num-block skin-2">
            <div className="num-in">
              <span
                className="minus dis"
                onClick={() => decrement(comp._id, cart, setCart, qty)}
              ></span>
              <input
                type="text"
                className="in-num"
                value={getValue(comp._id, qty)}
                onChange={handleChange}
                readOnly=""
              />
              <span
                className="plus"
                onClick={() => increment(comp._id, cart, setCart, qty)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ComponentsList;
