import React from "react";
// import Brand from "./shopBy/Brand";
import Category from "./shopBy/Category";
import Color from "./shopBy/Color";
import Price from './shopBy/Price'

const ShopSideNav = () => {
  return (
    <div className="w-full flex flex-col gap-6 shadow-md py-2 pr-2 pl-4 overflow-y-auto no-scrollbar">
      <Color />
      {/* <Brand /> */}
      <Price />
    </div>
  );
};

export default ShopSideNav;
