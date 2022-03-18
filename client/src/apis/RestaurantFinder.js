import axios from "axios";

export default axios.create({
  baseURL: "https://tasty-finder.herokuapp.com/api/v1/restaurants",}
  ,{ mode: 'cors' });