/* eslint-disable react/prop-types */
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import { motion } from "framer-motion";
import classes from "./Footer.module.css";

const Footer = ({
  setIsAddingModalOpen,
  setCurrentPage,
  setIsEditingModalOpen,
}) => {
  const openAddingModalHandler = () => {
    setIsAddingModalOpen(true);
  };

  const openEditingModalHandler = () => {
    setIsEditingModalOpen(true);
  };

  return (
    <div className={classes.footer}>
      <motion.div className={classes.iconBox} whileTap={{ scale: 1.15 }}>
        <DeleteIcon className={classes.icon} />
      </motion.div>

      <motion.div
        className={classes.iconBox}
        whileTap={{ scale: 1.15 }}
        onClick={openEditingModalHandler}
      >
        <EditIcon className={classes.icon} />
      </motion.div>

      <motion.div
        className={`${classes.iconBox} ${classes.main}`}
        whileTap={{ scale: 1.15 }}
        onClick={openAddingModalHandler}
      >
        <AddIcon className={`${classes.icon} ${classes.main}`} />
      </motion.div>

      <motion.div className={classes.iconBox} whileTap={{ scale: 1.15 }}>
        <CompareArrowsIcon className={classes.icon} />
      </motion.div>

      <motion.div
        className={classes.iconBox}
        whileTap={{ scale: 1.15 }}
        onClick={() => {
          setCurrentPage("main");
        }}
      >
        <MenuIcon className={classes.icon} />
      </motion.div>
    </div>
  );
};

export default Footer;
