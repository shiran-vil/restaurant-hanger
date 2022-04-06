
import {BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import UpdatePage from './routes/UpdatePage';
import RestaurantDetailPage from './routes/RestaurantDetailsPage';
import { RestaurantsContextProvider } from './context/RestaurantsContext';
import React from "react";
import SearchBox from './components/SearchBox';
function App() {
  return (
    <BrowserRouter>
      <RestaurantsContextProvider>
          <div className='container'>
          
            <Routes>
              <Route exact path="/" element={<Home />}></Route>
              <Route path="/restaurants/search" element={<SearchBox />}></Route>
              <Route exact path= "/restaurants/:id/update" element={<UpdatePage />}></Route>
              <Route exact path="/restaurants/:id" element={<RestaurantDetailPage />}></Route>
              
            </Routes>
          
          </div>
      </RestaurantsContextProvider>
    </BrowserRouter>
  );
}

export default App;
