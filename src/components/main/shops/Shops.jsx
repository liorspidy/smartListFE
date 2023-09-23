/* eslint-disable react/prop-types */
import { useEffect } from "react";
import classes from "./Shops.module.css";

const Shops = ({
  currentShop,
  setCurrentShop,
  shopsList,
  setShopsList,
  bestShopId,
  setLoading
}) => {
  const shopClickHandler = (shop) => {
    setCurrentShop(shop);
  };

  useEffect(() => {
    async function fetchShops() {
      try {
        setLoading(true);
        const response = await fetch(
          "https://woolen-shade-pea.glitch.me/getShops"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setShopsList(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching shops:", error);
      }
    }

    fetchShops();
  }, []);

  useEffect(() => {
    setCurrentShop(shopsList[0]);
  }, [shopsList]);

  const shoppingTabs = shopsList.map((shop) => (
    <li
      className={`${classes.shopTab} ${
        shop?.id === currentShop?.id ? classes.active : ""
      } ${shop?.id === bestShopId ? classes.best : ""}`}
      key={shop.id}
      onClick={() => {
        shopClickHandler(shop);
      }}
    >
      <div className={classes.shopContainer}>
        <img className={classes.shopImg} src={shop.img} alt={shop.name} />
      </div>
    </li>
  ));

  return (
    <>
      {shoppingTabs.length === 0 && (
        <p className={classes.loadingStores}>מייבא חנויות...</p>
      )}
      <ul className={classes.shops}>{shoppingTabs}</ul>
      {currentShop && (
        <p className={classes.shopLocation}>
          {currentShop?.address}, {currentShop?.city}
        </p>
      )}
    </>
  );
};

export default Shops;
