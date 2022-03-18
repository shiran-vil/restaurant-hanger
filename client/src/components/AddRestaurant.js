import React, { useContext, useState } from "react";
import RestaurantFinder from "../apis/RestaurantFinder";
import  {RestaurantsContext}  from "../context/RestaurantsContext";

const AddRestaurant = () => {
    const { addRestaurants } = useContext(RestaurantsContext);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("Price Range");

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           const response = await RestaurantFinder.post("/", {
        name: name,
        location: location,
        price_range: priceRange,
      });
      setName("");
      setLocation("");
      setPriceRange("Price Range")
      console.log(response.data.data);
      addRestaurants(response.data.data.restaurant); 
        } catch (error) {
            console.log(error);
        }
    }

    
    return (
        <div className="mb-4 add-rest-flex d-flex">
            <form className="" action="">
               
                <div className="row gy-2 gx-3">
                    <div className="col-auto ">
                        <input value={name}
                         onChange={(e) => setName(e.target.value)}
                          type="text" className="form-control" placeholder="Name"></input>
                    </div>
                    <div className="col-auto">
                        <input 
                        value={location}
                         onChange={(e) => setLocation(e.target.value)}
                         type="text" className="form-control" placeholder="Location"></input>
                    </div>
                    <div className="col-auto ">
                        <select value={priceRange}
                         onChange={(e) => setPriceRange(e.target.value)}
                         className="form-select ">
                            <option disabled>Price Range</option>
                            <option value="1">$</option>
                            <option value="2">$$</option>
                            <option value="3">$$$</option>
                            <option value="4">$$$$</option>
                            <option value="5">$$$$$</option>
                        </select>
                    </div>
                    <button onClick={handleSubmit} type="submit" className="btn btn-primary col-auto layout-style" >
                        Add
                    </button>
                </div>
                
            </form>
             
        </div>
    )
}

export default AddRestaurant;