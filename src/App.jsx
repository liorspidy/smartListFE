/* eslint-disable react/prop-types */
import "./App.css";
import Main from "./components/main/Main";
import Footer from "./components/footer/Footer";
import AddModal from "./components/main/add/addModal";
import { useEffect, useState } from "react";
import AddToDb from "./components/main/add/AddToDb";
import EditProduct from "./components/main/edit/EditProduct";
import EditModal from "./components/main/edit/EditModal";
import Loading from "./components/loader/loading";

function App() {
  const [isAddingModalOpen, setIsAddingModalOpen] = useState(false);
  const [isEditingModalOpen, setIsEditingModalOpen] = useState(false);
  const [shopsList, setShopsList] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentCart, setCurrentcart] = useState([]);
  const [currentPage, setCurrentPage] = useState("main");
  const [pickedProduct, setPickedProduct] = useState(null); // Added productId state
  const [loading, setLoading] = useState(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch(
        "https://woolen-shade-pea.glitch.me/getProducts"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

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
    fetchProducts();
  }, []);

  return (
    <>
    {loading && <Loading/>}
      <AddModal
        setIsAddingModalOpen={setIsAddingModalOpen}
        isAddingModalOpen={isAddingModalOpen}
        products={products}
        setCurrentcart={setCurrentcart}
        setCurrentPage={setCurrentPage}
        fetchCurrentCart={fetchCurrentCart}
        setLoading={setLoading}
      />
      <EditModal
        setIsEditingModalOpen={setIsEditingModalOpen}
        isEditingModalOpen={isEditingModalOpen}
        products={products}
        setCurrentcart={setCurrentcart}
        setCurrentPage={setCurrentPage}
        setPickedProduct={setPickedProduct}
        setLoading={setLoading}
      />
      {currentPage === "main" && (
        <Main
          isAddingModalOpen={isAddingModalOpen}
          setIsAddingModalOpen={setIsAddingModalOpen}
          setCurrentcart={setCurrentcart}
          currentCart={currentCart}
          shopsList={shopsList}
          setShopsList={setShopsList}
          fetchCurrentCart={fetchCurrentCart}
          setLoading={setLoading}
        />
      )}
      {currentPage === "addtodb" && (
        <AddToDb
          shopsList={shopsList}
          fetchCurrentCart={fetchCurrentCart}
          fetchProducts={fetchProducts}
          setLoading={setLoading}
        />
      )}
      {currentPage === "editproduct" && (
        <EditProduct
          shopsList={shopsList}
          fetchCurrentCart={fetchCurrentCart}
          fetchProducts={fetchProducts}
          pickedProduct={pickedProduct}
          setLoading={setLoading}
        />
      )}
      <Footer
        setIsAddingModalOpen={setIsAddingModalOpen}
        setCurrentPage={setCurrentPage}
        setIsEditingModalOpen={setIsEditingModalOpen}
      />
    </>
  );
}

export default App;
