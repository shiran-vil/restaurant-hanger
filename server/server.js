require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./db");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());

// Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {
  try {
    //const results = await db.query("select * from restaurants");
    const restaurantRatingsData = await db.query(
      "select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id order by location ASC;"
    );
     
    res.status(200).json({
      status: "success",
      results: restaurantRatingsData.rows.length,
      data: {
        restaurants: restaurantRatingsData.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});


//Search restaurants
app.get('/api/v1/restaurants/search', async (req, res) => {
  try {
     search_query = String(req.query.search_query)
  const searchResult = await db.query(`SELECT * FROM restaurants
              WHERE search_vector @@ to_tsquery($1)`,
    [ search_query ]);
    res.status(200).json({
      status: "success",
      results: searchResult.rows.length,
      data: {
        restaurants: searchResult.rows,
      },
    });
  } catch (error) {
    
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
     const name_vector = String(req.body.name);
  const location_vector = String(req.body.location);
  const search_vector = [name_vector,
                         location_vector]
    const results = await db.query(
      "INSERT INTO restaurants (name, location, price_range, search_vector) values ($1, $2, $3, to_tsvector($4)) returning *",
      [req.body.name, req.body.location, req.body.price_range, search_vector]
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
    const name_vector = String(req.body.name);
  const location_vector = String(req.body.location);
  const search_vector = [name_vector,
                         location_vector]
    const results = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3, search_vector=$4 where id = $5 returning *",
      [req.body.name, req.body.location, req.body.price_range, search_vector, req.params.id]
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

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});