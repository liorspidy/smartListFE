/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./EditProduct.module.css";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

const EditProduct = ({
  shopsList,
  fetchCurrentCart,
  fetchProducts,
  pickedProduct,
  setLoading,
}) => {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    amount: "1",
    volume: "",
    measurementUnit: "grams",
    ...Object.fromEntries(
      shopsList.map((shop) => [`${shop.id}_price`, ""])
    ),
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isEdited, setIsEdited] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [deletionError, setDeletionError] = useState("");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    if (pickedProduct) {
      setFormData({
        productName: pickedProduct.name,
        brand: pickedProduct.brand,
        amount: pickedProduct.amount.toString(),
        volume: pickedProduct.volume,
        measurementUnit:
          pickedProduct.volume_unit === "grams"
            ? "grams"
            : pickedProduct.volume_unit === "kilos"
            ? "kilos"
            : "liters",
        ...Object.fromEntries(
          shopsList.map((shop) => [
            `${shop.id}_price`,
            pickedProduct.prices[shop.id] === "9999.00" ? "" : pickedProduct.prices[shop.id] || "",
          ])
        ),
      });
    }
  }, [pickedProduct]);

  const variants = {
    open: { y: "3rem", opacity: 1, transition: { duration: 0.2 } },
    closed: { y: "-3rem", opacity: 0, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isEdited || deletionSuccess) {
        setIsEdited(false);
        setDeletionSuccess(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isEdited, deletionSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.productName.trim()) {
      errors.productName = "שם המוצר הוא שדה חובה";
    }
    if (!formData.brand.trim()) {
      errors.brand = "המותג הוא שדה חובה";
    }
    if (formData.volume.trim() === "" || parseFloat(formData.volume) <= 0) {
      errors.volume = "קיבולת חייבת להיות מספר גדול מאפס";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    try {
      setLoading(true);
      const pricesObj = {};
      shopsList.forEach((shop) => {
        const price = parseFloat(formData[`${shop.id}_price`]);
        if (!isNaN(price) && price > 0) {
          pricesObj[shop.id] = price;
        }
        if(isNaN(price)){
          pricesObj[shop.id] = 9999;
        }
      });

      const response = await fetch(
        "https://smartlist.glitch.me/updateProduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: pickedProduct.id,
            name: formData.productName,
            brand: formData.brand,
            amount: formData.amount,
            volume: formData.volume,
            measurementUnit: formData.measurementUnit,
            prices: pricesObj,
          }),
        }
      );

      if (response.status === 200) {
        fetchProducts();
        fetchCurrentCart();
        setIsEdited(true);
      } else {
        setUpdateError("Error updating product"); // Set update error message
        console.error("Error updating product:", response.statusText);
      }
    } catch (error) {
      setUpdateError("Error updating product"); // Set update error message
      console.error("Error updating product:", error.message);
    }finally{
      setLoading(false);
    }
  };

  const deleteProductHandler = async () => {
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
        setDeletionError("");
        fetchProducts();
        fetchCurrentCart();
      } else {
        setDeletionSuccess(false);
        setDeletionError("Error deleting product");
        console.error("Error deleting product:", response.statusText);
      }
    } catch (error) {
      setDeletionSuccess(false);
      setDeletionError("Error deleting product");
      console.error("Error deleting product:", error);
    }finally{
      setLoading(false);
    }
  };

  const inputPrices = shopsList.map((shop) => (
    <li className={classes.priceItem} key={shop.id}>
      <div className={classes.storeLogo}>
        <img src={shop.img} alt={shop.name} />
      </div>
      <input
        type="text"
        name={`${shop.id}_price`}
        value={formData[`${shop.id}_price`]}
        placeholder="הזן מחיר..."
        onChange={handleInputChange}
      />
    </li>
  ));

  return (
    <div className={classes.editindb}>
      <motion.div
        className={classes.finalStatus}
        animate={(isEdited || deletionSuccess) ? "open" : "closed"}
        variants={variants}
      >
        {isEdited && updateError === "" ? (
          <p className={classes.status}>
            המוצר עודכן בהצלחה
            <span className={classes.checkmark}>
              <CheckIcon />
            </span>
          </p>
        ) : deletionSuccess && deletionError === "" ? (
          <p className={classes.status}>
            המוצר נמחק בהצלחה
            <span className={classes.checkmark}>
              <CheckIcon />
            </span>
          </p>
        ) : null}
      </motion.div>
      <div className={classes.tabs}>
        <motion.button className={classes.tab} whileTap={{ scale: 1.1 }}>
          מוצר
        </motion.button>
        <motion.button className={classes.tab} whileTap={{ scale: 1.1 }}>
          חנות
        </motion.button>
      </div>
      <form onSubmit={handleSubmit} className={classes.form}>
        <div className={classes.formContent}>
          <div className={classes.formGroup}>
            <label htmlFor="productName">שם המוצר:</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              placeholder="הזן שם..."
            />
            {validationErrors.productName && (
              <div className={classes.error}>
                {validationErrors.productName}
              </div>
            )}
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="brand">מותג:</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              placeholder="הזן מותג..."
            />
            {validationErrors.brand && (
              <div className={classes.error}>{validationErrors.brand}</div>
            )}
          </div>
          <div className={classes.formGroup}>
            <label htmlFor="amount">כמות:</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              min={1}
              placeholder="הזן כמות..."
            />
          </div>
          <div className={classes.volumeContainer}>
            <div className={classes.formGroup}>
              <label htmlFor="volume">קיבולת:</label>
              <input
                type="text"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                min={1}
                placeholder="הזן קיבולת..."
              />
              {validationErrors.volume && (
                <div className={classes.error}>{validationErrors.volume}</div>
              )}
            </div>
            <div className={classes.formGroup}>
              <label htmlFor="measurementUnit">יח' מדידה:</label>
              <select
                id="measurementUnit"
                name="measurementUnit"
                value={formData.measurementUnit}
                onChange={handleInputChange}
              >
                <option value="grams">גרם</option>
                <option value="kilos">קילו</option>
                <option value="liters">ליטר</option>
              </select>
            </div>
          </div>
          <ul className={classes.inputPricesContainer}>{inputPrices}</ul>
        </div>
        <div className={classes.editActions}>
          <motion.button className={classes.editAction} whileTap={{ scale: 1.1 }} type="submit">
            סיימתי
            <SaveIcon />
          </motion.button>
          <motion.button
            className={classes.editAction}
            type="button" 
            whileTap={{ scale: 1.1 }}
            onClick={deleteProductHandler}
          >
            הסר מוצר
            <DeleteIcon />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
