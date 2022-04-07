require("dotenv").config();
const express = require("express");
const cors = require("cors");
const url = require('url');
const querystring = require('querystring');
const db = require("./db");

const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
      const { search } = req.query
  let response

  if (search) {
    response = await db.query("select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id WHERE to_tsvector('english', name || ' ' || location) @@ to_tsquery('english', $1) OR lower(name) like '%$1%' OR lower(location) like '%$1%'", [search]);
  } else {
    response = await db.query( "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id order by location ASC"); 
  }
    // const restaurantRatingsData = await db.query(
    //   "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id order by location ASC"
    // );
    res.status(200).json({
      status: "success",
      results: response.rows.length,
      data: {
        restaurants: response.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});


//Search restaurants
app.get("/api/v1/restaurants/:search", async (req, res) => {
    let search_query = String(req.query.search_query);
    console.log(search_query);
  try {
    
    // const searchFilter = search_query ? { search_query: { $regex: search_query, $options: 'i' } } : {};
    //console.log(search_query);
   
    const searchResult = await db.query("SELECT id, name, location, price_range FROM restaurants WHERE to_tsvector('english', name || ' ' || location) @@ to_tsquery('english', $1) OR lower(name) like '%$1%' OR lower(location) like '%$1%'",
      [search_query]);
     console.log(searchResult);
    res.status(200).json({
      status: "success",
      data: {
        searchRestaurants: searchResult.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }

});


//Get a Restaurant
app.get("/api/v1/restaurants/:id", async (req, res) => {

  console.log(req.params.id);

  try {
    const restaurant = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1",
      [req.params.id]
    );
    // select * from restaurants wehre id = req.params.id

    const reviews = await db.query(
      "select * from reviews where restaurant_id = $1",
      [req.params.id]
    );
    console.log(reviews);

    res.status(200).json({
      status: "succes",
      data: {
        restaurant: restaurant.rows[0],
        reviews: reviews.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

// Create a Restaurant

app.post("/api/v1/restaurants", async (req, res) => {

  console.log(req.body);

  try {

    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *",
      [req.body.name, req.body.location, req.body.price_range]
    );

    console.log(results);
    res.status(201).json({
      status: "succes",
      data: {
        restaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});


// Update Restaurants

app.put("/api/v1/restaurants/:id", async (req, res) => {

  try {

    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *",
      [req.body.name, req.body.location, req.body.price_range, req.params.id]
    );

    res.status(200).json({
      status: "succes",
      data: {
        retaurant: results.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
  console.log(req.params.id);
  console.log(req.body);
});

// Delete Restaurant

app.delete("/api/v1/restaurants/:id", async (req, res) => {

  try {
    const results = db.query("DELETE FROM restaurants where id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "sucess",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/restaurants/:id/addReview", async (req, res) => {

  try {
    const newReview = await db.query(
      "INSERT INTO reviews (restaurant_id, name, review, rating) values ($1, $2, $3, $4) returning *;",
      [req.params.id, req.body.name, req.body.review, req.body.rating]
    );
    console.log(newReview);
    res.status(201).json({
      status: "success",
      data: {
        review: newReview.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});