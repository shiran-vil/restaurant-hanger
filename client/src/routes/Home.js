import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AddRestaurant from "../components/AddRestaurant";
import RestaurantList from "../components/RestaurantList";


const Home = () => {
  return (
    <div className="page-container">
  
      <Header />
      <AddRestaurant />
      <RestaurantList />
      <Footer />
    </div>
  );
};

export default Home;