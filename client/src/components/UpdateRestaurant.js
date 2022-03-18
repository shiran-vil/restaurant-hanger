import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import RestaurantFinder from "../apis/RestaurantFinder";
import { RestaurantsContext } from "../context/RestaurantsContext";

const UpdateRestaurant = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const { restaurant } = useContext(RestaurantsContext);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [priceRange, setPriceRange] = useState("Price Range");
    
    useEffect(() => {
        const fetchData = async () => {
            const response = await RestaurantFinder.get(`/${id}`)
            console.log(response);
            setName(response.data.data.restaurant.name);
            setLocation(response.data.data.restaurant.location);
            setPriceRange(response.data.data.restaurant.price_range);

        }
        fetchData();
    }, []);
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedRestaurant = await RestaurantFinder.put(`/${id}`, {
        name: name,
        location: location,
        price_range: priceRange,
      });
        navigate("/")
    }
    return (
        <div>
             <form >
             <div className="form-group">
                <label htmlFor="name">Name</label>
                <input id="name" value={name} onChange={(e) => setName(e.target.value)}
                 className="form-control" type="text"></input>
            </div>
            <div className="form-group space">
                <label htmlFor="location">Location</label>
                <input id="location" value={location} onChange={(e) => setLocation(e.target.value)}
                 className="form-control" type="text"></input>
            </div>
            <div className="form-group space">
                <label htmlFor="price_range">Price Range</label>
              
                 <select value={priceRange}
                         onChange={(e) => setPriceRange(e.target.value)}
                         className="form-select">
                            <option disabled>Price Range</option>
                            <option value="1">$</option>
                            <option value="2">$$</option>
                            <option value="3">$$$</option>
                            <option value="4">$$$$</option>
                            <option value="5">$$$$$</option>
                        </select>
            </div>
                <button onClick={handleSubmit} type="submit" className="btn btn-primary layout-style space" >
                        Update
                    </button>
             </form> 
        </div>
    )
}

export default UpdateRestaurant;