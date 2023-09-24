/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./AddToDb.module.css";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { motion } from "framer-motion";

const AddToDb = ({ shopsList, fetchCurrentCart, fetchProducts ,setLoading}) => {
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    amount: "1",
    volume: "",
    measurementUnit: "grams",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [isAdded, setIsAdded] = useState(false);

  const variants = {
    open: { y: "3rem", opacity: 1, transition: { duration: 0.2 } },
    closed: { y: "-3rem", opacity: 0, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isAdded) {
        setIsAdded(false);
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [isAdded]);

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
        if(isNaN(price)){
          pricesObj[shop.id] = 9999;
        }
      });

      const response = await fetch(
        "https://smartlist.glitch.me/addProductToDB",
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
        setFormData({
          productName: "",
          brand: "",
          amount: "1",
          volume: "",
          measurementUnit: "grams",
          // Reset prices to empty string
          ...Object.fromEntries(
            shopsList.map((shop) => [`${shop.id}_price`, ""])
          ),
        });
        fetchProducts();
        fetchCurrentCart();
        setIsAdded(true);
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
    <div className={classes.addtodb}>
      <motion.div
        className={classes.finalStatus}
        animate={isAdded ? "open" : "closed"}
        variants={variants}
      >
        <p className={classes.status}>
          המוצר נוסף בהצלחה
          <span className={classes.checkmark}>
            <CheckIcon />
          </span>
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
        <div className={classes.buttons}>
        <motion.button className={classes.addAction} type="submit" whileTap={{scale: 1.1}}>
          הוסף מוצר
          <AddIcon/>
        </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AddToDb;
