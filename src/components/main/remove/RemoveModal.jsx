/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Search from "../list/Search";
import classes from "./RemoveModal.module.css";

const RemoveModal = ({
  products,
  fetchProducts,
  fetchCurrentCart,
  isRemovingModalOpen,
  setIsRemovingModalOpen,
  setLoading
}) => {
  const [searchProductToRemove, setSearchProductToRemove] = useState("");
  const [isSelectedProductToRemove, setisSelectedProductToRemove] = useState(
    false
  );
  const [pickedProduct, setPickedProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const restartModal = () => {
    setIsRemovingModalOpen(false);
    setSearchProductToRemove("");
    setPickedProduct(null);
    setIsDeleting(false);
  };

  const closeModalHandler = () => {
    restartModal();
  };

  const fetchProductById = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(`https://smartlist.glitch.me/getProductById/${productId}`);
      if (!response.ok) {
        throw new Error("Error fetching product details");
      }
      const data = await response.json();
      setPickedProduct(data.product);
      setIsDeleting(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }finally{
      setLoading(false);
    }
  };

  const removeProductHandler = async (e) => {
    e.stopPropagation();
    if (pickedProduct) {
      await fetchProductById(pickedProduct.id);
    }
  };

  const removeShopHandler = (e) => {
    e.stopPropagation();
    restartModal();
  };

  const cancelHandler = () => {
    setIsDeleting(false);
    setPickedProduct(null);
    setSearchProductToRemove("");
    setisSelectedProductToRemove(false);
  };

  const approveHandler = async () => {
      const id = pickedProduct.id;
      try {
        setLoading(true);
        const response = await fetch(
          `https://smartlist.glitch.me/deleteProduct/${id}`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
          }
        );
  
        if (response.status === 200) {
          setDeletionSuccess(true);
          fetchProducts();
          fetchCurrentCart();
          restartModal();
        } else {
          setDeletionSuccess(false);
          console.error("Error deleting product:", response.statusText);
        }
      } catch (error) {
        setDeletionSuccess(false);
        console.error("Error deleting product:", error);
      }finally{
        setLoading(false);
      }
  };

  useEffect(() => {
    const isExactMatch = products.some((product) => {
      return (
        product.name.toLowerCase() ===
        searchProductToRemove.toLowerCase().trim()
      );
    });
    if (isExactMatch) {
      setisSelectedProductToRemove(true);
    } else {
      setisSelectedProductToRemove(false);
    }
  }, [searchProductToRemove]);

  const productsSearchList =
    searchProductToRemove.trim().length === 0
      ? products
      : products.filter((product) =>
          product.name
            .toLowerCase()
            .includes(searchProductToRemove.toLowerCase())
        );

  const productsList = productsSearchList.map((product) => (
    <li
      className={classes.productItem}
      key={product.id}
      onClick={() => {
        setisSelectedProductToRemove(true);
        setSearchProductToRemove(product.name);
        setPickedProduct(product);
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

  if (isDeleting && pickedProduct) {
    return (
      <div
        className={`${classes.backdrop} ${
          isRemovingModalOpen ? classes.active : ""
        }`}
        onClick={closeModalHandler}
      >
        <div
          className={`${classes.modal} ${
            isRemovingModalOpen ? classes.active : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={classes.validationText}>
            <p>האם אתה בטוח שברצונך למחוק את</p>
            <p>{pickedProduct.name}?</p>
          </div>
          <div className={classes.validationButtons}>
            <button className={classes.validationButton} onClick={approveHandler}>
              כן
            </button>
            <button className={classes.validationButton} onClick={cancelHandler}>
              לא
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${classes.backdrop} ${
        isRemovingModalOpen ? classes.active : ""
      }`}
      onClick={closeModalHandler}
    >
      <div
        className={`${classes.modal} ${
          isRemovingModalOpen ? classes.active : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.searchContainer}>
          <Search
            setSearchTerm={setSearchProductToRemove}
            searchTerm={searchProductToRemove}
            placeholder="חפשו ברשימה..."
          />
          <ul>{productsList}</ul>
        </div>
        <div className={classes.removeList}>
          <button
            disabled={!isSelectedProductToRemove}
            className={`${classes.removeItem} ${
              !isSelectedProductToRemove ? classes.disabled : ""
            }`}
            onClick={removeProductHandler}
          >
            מחק מוצר
          </button>
          <button className={classes.removeItem} onClick={removeShopHandler}>
            מחק חנות
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveModal;
