/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Search from "../list/Search";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import classes from "./AddModal.module.css";
import { motion } from "framer-motion";

const AddModal = ({
  products,
  isAddingModalOpen,
  setIsAddingModalOpen,
  setCurrentPage,
  fetchCurrentCart,
  setLoading
}) => {
  const [searchProduct, setSearchProduct] = useState("");
  const [isSelectedProduct, setIsSelectedProduct] = useState(false);
  const [amount, setAmount] = useState(1);

  const restartModal = () => {
    setIsAddingModalOpen(false);
    setAmount(1);
    setSearchProduct("");
  };

  const closeModalHandler = () => {
    setIsAddingModalOpen(false);
    restartModal();
  };

  const addToBasketHandler = (e) => {
    setLoading(true);
    e.stopPropagation();
    if (isSelectedProduct && searchProduct.trim().length > 0) {
      const productData = {
        name: searchProduct.trim(),
        amount: amount,
      };

      fetch("https://woolen-shade-pea.glitch.me/addProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })
        .then((response) => response.json())
        .then((data) => {
          // After successfully adding the product, fetch the updated cart
          fetchCurrentCart();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error adding product to the basket:", error);
        });
    }
    restartModal();
  };

  const addToDbHandler = (e) => {
    e.stopPropagation();
    setCurrentPage("addtodb");
    restartModal();
  };

  const addAmountHandler = () => {
    setAmount((prev) => (prev = prev + 1));
  };

  const decAmountHandler = () => {
    setAmount((prev) => {
      if (prev > 1) {
        return (prev = prev - 1);
      } else {
        return 1;
      }
    });
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const selectProductNameHandler = (product) => {
    setIsSelectedProduct(true);
    setSearchProduct(product.name);
  };

  const productsSearchList = filteredProducts.map((product) => (
    <li
      className={classes.productItem}
      key={product.id}
      onClick={selectProductNameHandler.bind(this, product)}
    >
      <p className={classes.productName}>
        {product.name}{" "}
        <span className={classes.volume}>
          {parseFloat(product.volume)}&nbsp;
          {product.volume_unit === "grams"
            ? "גרם"
            : product.volume_unit === "kilos"
            ? "קילו"
            : product.volume_unit === "liters"
            ? "ליטר"
            : ""}
        </span>
      </p>
      <p className={classes.productBrand}>{product.brand}</p>
    </li>
  ));

  useEffect(() => {
    const isExactMatch = products.some((product) => {
      return product.name.toLowerCase() === searchProduct.toLowerCase().trim();
    });
    if (isExactMatch) {
      setIsSelectedProduct(true);
    } else {
      setIsSelectedProduct(false);
    }
  }, [searchProduct]);

  return (
    <div
      className={`${classes.backdrop} ${
        isAddingModalOpen ? classes.active : ""
      }`}
      onClick={closeModalHandler}
    >
      <div
        className={`${classes.modal} ${
          isAddingModalOpen ? classes.active : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.searchContainer}>
          <Search
            setSearchTerm={setSearchProduct}
            searchTerm={searchProduct}
            placeholder="חפשו ברשימה..."
          />
          {searchProduct.length > 0 && !isSelectedProduct && (
            <ul>{productsSearchList}</ul>
          )}
        </div>
        <div className={classes.amountActions}>
          <motion.div
            whileTap={{
              scale: 1.3,
            }}
            onClick={addAmountHandler}
          >
            <AddIcon className={classes.countIcon} />
          </motion.div>
          <span className={classes.amountValue}>{amount}</span>
          <motion.div whileTap={{ scale: 1.3 }} onClick={decAmountHandler}>
            <RemoveIcon className={classes.countIcon} />
          </motion.div>
        </div>
        <div className={classes.addingList}>
          <button
            disabled={!isSelectedProduct}
            className={`${classes.addingItem} ${
              !isSelectedProduct ? classes.disabled : ""
            }`}
            onClick={addToBasketHandler}
          >
            הוסף לסל
          </button>
          <button className={classes.addingItem} onClick={addToDbHandler}>
            הוסף למאגר
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
