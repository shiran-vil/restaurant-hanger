import axios from "axios";

export default axios.create({
  baseURL: "https://restaurant-hanger.herokuapp.com/api/v1/restaurants",
});