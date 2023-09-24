/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Search from "../list/Search";
import classes from "./EditModal.module.css";

const EditModal = ({
  products,
  isEditingModalOpen,
  setIsEditingModalOpen,
  setCurrentPage,
  setPickedProduct,
  setLoading
}) => {
  const [searchProductToEdit, setSearchProductToEdit] = useState("");
  const [isSelectedProductToEdit, setIsSelectedProductToEdit] = useState(false);
  const [pickedProductId , setPickedProductId] = useState(null);

  const restartModal = () => {
    setIsEditingModalOpen(false);
    setSearchProductToEdit("");
    setPickedProductId(null); // Reset productId when modal is restarted
  };

  const closeModalHandler = () => {
    setIsEditingModalOpen(false);
    restartModal();
  };

  const editProductHandler = async (e) => {
    e.stopPropagation();
    setCurrentPage("editproduct");
  
    if (pickedProductId) {
      try {
        setLoading(true);
        const response = await fetch(`https://smartlist.glitch.me/getProductById/${pickedProductId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        if (data.error) {
          console.error("Error:", data.error);
        } else {
          const product = data.product;
  
          // Update the prices inside the product object
          const productWithPrices = { ...product };
          productWithPrices.prices = product.prices.reduce((priceMap, priceItem) => {
            priceMap[priceItem.shop_id] = priceItem.price;
            return priceMap;
          }, {});
  
          setPickedProduct(productWithPrices);
        }
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  
    restartModal();
  };
  

  const editShopHandler = (e) => {
    e.stopPropagation();
    // setCurrentPage("editshop");
    restartModal();
  };

  useEffect(() => {
    const isExactMatch = products.some((product) => {
      return (
        product.name.toLowerCase() === searchProductToEdit.toLowerCase().trim()
      );
    });
    if (isExactMatch) {
      setIsSelectedProductToEdit(true);
    } else {
      setIsSelectedProductToEdit(false);
    }
  }, [searchProductToEdit]);

  const productsSearchList =
    searchProductToEdit.trim().length === 0
      ? products
      : products.filter((product) =>
          product.name.toLowerCase().includes(searchProductToEdit.toLowerCase())
        );

  const productsList = productsSearchList.map((product) => (
    <li
      className={classes.productItem}
      key={product.id}
      onClick={() => {
        setIsSelectedProductToEdit(true);
        setSearchProductToEdit(product.name);
        setPickedProductId(product.id);
      }}
    >
      <p className={classes.productName}>
        {product.name}
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

  return (
    <div
      className={`${classes.backdrop} ${
        isEditingModalOpen ? classes.active : ""
      }`}
      onClick={closeModalHandler}
    >
      <div
        className={`${classes.modal} ${
          isEditingModalOpen ? classes.active : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.searchContainer}>
          <Search
            setSearchTerm={setSearchProductToEdit}
            searchTerm={searchProductToEdit}
            placeholder="חפשו ברשימה..."
          />
          <ul>{productsList}</ul>
        </div>
        <div className={classes.editList}>
          <button
            disabled={!isSelectedProductToEdit}
            className={`${classes.editItem} ${
              !isSelectedProductToEdit ? classes.disabled : ""
            }`}
            onClick={editProductHandler}
          >
            ערוך מוצר
          </button>
          <button className={classes.editItem} onClick={editShopHandler}>
            ערוך חנות
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
