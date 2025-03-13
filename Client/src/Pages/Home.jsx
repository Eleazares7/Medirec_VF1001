import React from 'react'
import SearchBar from '../Components/SerachBar'
import Navbar from '../Components/NavBar'
import Banner from '../Components/Banner'


const Home = () => {
    return (
        <div className="bg-gray-100">
          <Navbar /> {/* Fijo en la parte superior */}
          <Banner /> {/* Ocupa toda la pantalla */}         
        </div>
      );
}

export default Home
