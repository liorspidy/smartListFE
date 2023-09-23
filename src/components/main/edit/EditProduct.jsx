/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./EditProduct.module.css";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { motion } from "framer-motion";

const EditProduct = ({ shopsList, fetchCurrentCart, fetchProducts , pickedProduct, setLoading }) => {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    amount: "1",
    volume: "",
    measurementUnit: "grams",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isEdited, setIsEdited] = useState(false);

    // Update formData with pickedProduct when it changes
    useEffect(() => {
      if (pickedProduct) {
        setFormData({
          productName: pickedProduct.name,
          brand: pickedProduct.brand,
          amount: pickedProduct.amount.toString(),
          volume: pickedProduct.volume,
          measurementUnit: pickedProduct.volume_unit_id === 1 ? "grams" : "liters", // Adjust as needed
        });
      }
    }, [pickedProduct]);

  const variants = {
    open: { y: "3rem", opacity: 1, transition: { duration: 0.2 } },
    closed: { y: "-3rem", opacity: 0, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isEdited) {
        setIsEdited(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isEdited]);

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
      // Prepare prices object from the input fields
      const pricesObj = {};
      shopsList.forEach((shop) => {
        const price = parseFloat(formData[`${shop.id}_price`]);
        if (!isNaN(price) && price > 0) {
          pricesObj[shop.id] = price;
        }
      });

      const response = await fetch(
        "https://woolen-shade-pea.glitch.me/addProductToDB",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
        // Successfully added the product
        console.log("Product added successfully!");
        // You can optionally reset the form here
        setFormData({
          productName: "",
          brand: "",
          amount: "1",
          volume: "",
          measurementUnit: "grams",
        });
        fetchProducts();
        fetchCurrentCart();
        setIsEdited(true);
        setLoading(false);
      } else {
        // Handle server error here
        console.error("Error adding product:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding product:", error.message);
    }
  };

  const inputPrices = shopsList.map((shop) => {
    return (
      <li className={classes.priceItem} key={shop.id}>
        <div className={classes.storeLogo}>
          <img src={shop.img} alt={shop.name} />
        </div>
        <input
          type="text"
          name={`${shop.id}_price`} // Use shop ID to uniquely identify prices
          value={formData[`${shop.id}_price`]}
          placeholder="הזן מחיר..."
          onChange={handleInputChange} // Handle price changes
        />
      </li>
    );
  });

  return (
    <div className={classes.editindb}>
      <motion.div
        className={classes.finalStatus}
        animate={isEdited ? "open" : "closed"}
        variants={variants}
      >
        <p className={classes.status}>
          המוצר עודכן בהצלחה
          <div className={classes.checkmark}>
            <CheckIcon />
          </div>
        </p>
      </motion.div>
      <div className={classes.tabs}>
        <motion.button className={classes.tab} whileTap={{scale: 1.1}}>מוצר</motion.button>
        <motion.button className={classes.tab} whileTap={{scale: 1.1}}>חנות</motion.button>
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
        <motion.button className={classes.editAction} type="submit" whileTap={{scale: 1.1}}>
          סיימתי
          <SaveIcon/>
        </motion.button>
        <motion.button className={classes.editAction} whileTap={{scale: 1.1}}>
          הסר מוצר
          <DeleteIcon/>
        </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
