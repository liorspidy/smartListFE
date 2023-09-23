/* eslint-disable react/prop-types */
import classes from "./Main.module.css";
import List from "./list/List";
import { useState } from "react";
import Search from "./list/Search";
import Shops from "./shops/Shops";

const Main = ({
  setCurrentcart,
  currentCart,
  setShopsList,
  shopsList,
  setLoading
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentShop, setCurrentShop] = useState(shopsList[0] || null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bestShopId, setBestShopId] = useState(null);

  return (
    <div className={classes.main}>
      <Search
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        placeholder="סינון מהיר..."
      />
      <Shops
        currentShop={currentShop}
        setCurrentShop={setCurrentShop}
        setShopsList={setShopsList}
        shopsList={shopsList}
        bestShopId={bestShopId}
        setLoading={setLoading}
      />
      <List
        searchTerm={searchTerm}
        currentShop={currentShop}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
        shopsList={shopsList}
        setBestShopId={setBestShopId}
        setCurrentcart={setCurrentcart}
        currentCart={currentCart}
        setLoading={setLoading}
      />
    </div>
  );
};

export default Main;
