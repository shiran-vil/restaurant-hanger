import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/RestaurantFinder";



const SearchBox = (props) => {
  const query = new URLSearchParams(useLocation().search);
  const search_query = query.get("search_query");
  // let [searchParams, setSearchParams] = useSearchParams();
  // let search_query = searchParams.get("search_query");
  console.log(search_query);
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  const navigate = useNavigate();
  const handleRestaurantSelect = (id) => {
    navigate(`/restaurants/${id}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/search?search_query=${search_query}`);

        console.log(response.data.data);
        setRestaurants(response.data.data.searchRestaurants);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);



  return (

    <div className="list-group content-wrap">
      <h2 className="text-center">Search Results for '{search_query}'</h2>
      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>

          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr onClick={() => handleRestaurantSelect(restaurant.id)}
                key={restaurant.name}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{"$".repeat(restaurant.price_range)}</td>

                </tr>
              );
            })}

        </tbody>
      </table>
      <Link to={"/"}>Back to all restaurants</Link>
    </div>
  );
};

export default SearchBox;