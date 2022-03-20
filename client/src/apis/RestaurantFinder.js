import axios from "axios";

// const baseURL = "https://localhost5000/api/v1/restaurants";

const baseURL = process.env.NODE_ENV === 'production'
 ? "api/v1/restaurants"
 : "https://localhost5000/api/v1/restaurants";
export default axios.create({
  baseURL});