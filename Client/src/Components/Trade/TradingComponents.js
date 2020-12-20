import React from "react";

function TradeComponents({ list, increment, decrement, cart, setCart }) {
  const handleChange = () => {};
  const getValue = (_id, qty) => {
    let val;
    if (!cart[_id]) val = 0;
    else val = cart[_id];
    return qty ? `${val}/${qty}` : `${val}`;
  };
  return (
    <div>
      {list.map(({ name, _id, qty }) => (
        <div className="control-row" key={_id}>
          <button className="component-list">{name}</button>
          <div className="num-block skin-2">
            <div className="num-in">
              <span
                className="minus dis"
                onClick={() => decrement(_id, cart, setCart, qty)}
              ></span>
              <input
                type="text"
                className="in-num"
                value={getValue(_id, qty)}
                onChange={handleChange}
                readOnly=""
              />
              <span
                className="plus"
                onClick={() => increment(_id, cart, setCart, qty)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TradeComponents;
