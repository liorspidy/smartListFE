/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import classes from "./ListItem.module.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";

const ListItem = ({
  product,
  idx,
  addAmount,
  decAmount,
  fetchCurrentCart,
  setLoading,
}) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isNoPrice, setIsNoPrice] = useState(false);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    //swipe left
    if (touchStart - touchEnd > 100) {
      if (isSwiped) {
        setIsSwiped(false);
      } else {
        setIsChecked(true);
      }
    }

    //swipe right
    if (touchStart - touchEnd < -100) {
      if (!isChecked && !isSwiped) {
        setIsSwiped(true);
      } else if (isChecked && !isSwiped) {
        setIsChecked(false);
      }
    }
  };

  const handleRemoveClick = async (productId) => {
    try {
      setLoading(true);
      await fetch("https://smartlist.glitch.me/removeFromCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      // Fetch the updated current cart after adding the amount
      fetchCurrentCart();
      setIsSwiped(false);
    } catch (error) {
      console.error("Error adding quantity to product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product.price === "9999.00") {
      setIsNoPrice(true);
    }
  }, [product]);

  return (
    <li
      className={`${classes.listItem} ${
        isSwiped || isNoPrice
          ? classes.swiped
          : isChecked
          ? classes.checked
          : ""
      }`}
      key={idx}
    >
      <div className={classes.pre}>
        <span className={classes.count}>{product.quantity}</span>
        <div className={classes.countActions}>
          <motion.div
            whileTap={{
              scale: 1.3,
            }}
            onClick={() => {
              addAmount(product.product_id);
            }}
          >
            <AddIcon className={classes.countIcon} />
          </motion.div>
          <motion.div
            whileTap={{ scale: 1.3 }}
            onClick={() => {
              decAmount(product.product_id);
            }}
          >
            <RemoveIcon className={classes.countIcon} />
          </motion.div>
        </div>
      </div>
      <div
        className={classes.content}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={classes.right}>
          <div className={classes.productName}>{product.product_name}</div>
          <div className={classes.productBrand}>{product.brand_name}</div>
        </div>
        <div className={classes.left}>
          {product.price !== "9999.00" && (
            <span className={classes.productPrice}>
              {(product.price * product.quantity).toFixed(2)} &#8362;
            </span>
          )}
          {product.price === "9999.00" && (
            <span className={classes.productPrice}>--</span>
          )}
        </div>
      </div>
      <div
        className={`${classes.removeItem} ${isSwiped ? classes.active : ""}`}
        onClick={() => {
          handleRemoveClick(product.product_id);
        }}
      >
        <DeleteIcon />
      </div>
    </li>
  );
};

export default ListItem;
