import React, { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { RestaurantsContext } from "../context/RestaurantsContext";
import RestaurantFinder from "../apis/RestaurantFinder";
import StarRating from "./StarRating";


const SearchBox = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const search_query = searchParams.get('search_query')
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);
  console.log(search_query);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/?search_query=${search_query}`);

        console.log(response.data.data);
        setRestaurants(response.data.data.restaurants);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };

  return (

    <div className="list-group content-wrap">
      <h2 className="text-center">Search Results for '{search_query}'</h2>

      <table className="table table-hover table-dark">
        <thead>
          <tr className="bg-primary">
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>

          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((restaurant) => {
              return (
                <tr key={restaurant.name}>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.location}</td>
                  <td>{"$".repeat(restaurant.price_range)}</td>
                  <td>{renderRating(restaurant)}</td>

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