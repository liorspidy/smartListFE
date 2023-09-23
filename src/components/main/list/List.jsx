/* eslint-disable react/prop-types */
import classes from "./List.module.css";
import { useEffect, useState } from "react";
import ListItem from "./ListItem";

const List = ({
  searchTerm,
  currentShop,
  totalPrice,
  setTotalPrice,
  shopsList,
  setBestShopId,
  setCurrentcart,
  currentCart,
  setLoading
}) => {
  const [totalItems, setTotalItems] = useState(0);

  async function fetchCurrentCart() {
    try {
      setLoading(true);
      const response = await fetch(
        "https://woolen-shade-pea.glitch.me/getCurrentCart"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setCurrentcart(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching current cart:", error);
    }
  }

  useEffect(() => {
    fetchCurrentCart();
  }, []);

  const filteredList = currentCart.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to add 1 to the quantity of a product
  const addAmount = async (productId) => {
    try {
      setLoading(true);
      await fetch("https://woolen-shade-pea.glitch.me/addAmount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      // Fetch the updated current cart after adding the amount
      fetchCurrentCart();
      setLoading(false);
    } catch (error) {
      console.error("Error adding quantity to product:", error);
    }
  };

  // Function to decrease the quantity of a product
  const decAmount = async (productId) => {
    try {
      setLoading(true);
      await fetch("https://woolen-shade-pea.glitch.me/decAmount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      // Fetch the updated current cart after decreasing the amount
      fetchCurrentCart();
      setLoading(false);
    } catch (error) {
      console.error("Error decreasing quantity of product:", error);
    }
  };

  const productsList = filteredList
    .sort((a, b) => a.id - b.id)
    .map((product, idx) => {
      if (product.shop_id === currentShop?.id) {
        return (
          <ListItem
            product={product}
            key={idx}
            addAmount={addAmount}
            decAmount={decAmount}
            fetchCurrentCart={fetchCurrentCart}
          />
        );
      }
    });

  const findBestShopId = () => {
    var totalPriceList = [];

    for (let i = 1; i <= shopsList.length; i++) {
      var tempPrice = 0;
      for (let j = 0; j < filteredList.length; j++) {
        if (filteredList[j].shop_id === i) {
          if(filteredList[j].price!== "9999.00"){
            tempPrice =
              tempPrice +
              parseFloat(filteredList[j].price) *
                parseInt(filteredList[j].quantity);
          }
        }
      }
      totalPriceList.push(tempPrice);
    }

    var temp = 9999999;
    totalPriceList.forEach((val) => {
      if (val < temp) {
        temp = val;
      }
    });
    return totalPriceList.indexOf(temp) + 1;
  };

  useEffect(() => {
    var tempPrice = 0;
    var tempTotal = 0;
    filteredList.map((product) => {
      if (product.shop_id === currentShop?.id) {
        if(product.price!== "9999.00"){
        tempPrice =
          tempPrice + parseInt(product.quantity) * parseFloat(product.price);
        tempTotal = tempTotal + parseInt(product.quantity);
        }
      }
    });
    setBestShopId(findBestShopId());
    setTotalItems(tempTotal);
    setTotalPrice(tempPrice);
  }, [currentCart, currentShop]);

  return (
    <div className={classes.listPage}>
      {productsList.length > 0 && (
        <ul className={classes.list}>{productsList}</ul>
      )}
      {productsList.length === 0 && (
        <div className={classes.emptyList}>
          <span>לא נמצאו פריטים ברשימה...</span>
        </div>
      )}
      <div className={classes.total}>
        <div className={classes.totalItems}>{totalItems}</div>
        <div className={classes.totalPrice}>
          {totalPrice.toFixed(2)} &#8362;
        </div>
      </div>
    </div>
  );
};

export default List;
