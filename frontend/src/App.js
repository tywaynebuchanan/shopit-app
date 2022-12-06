import {BrowserRouter as Router, Route, Routes}  from 'react-router-dom'
import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import ProductDetails from './components/product/ProductDetails'

function App() {
  return (
    <Router>
        <div className="App">
        <Header/>
          <div className = "container container-fluid">
          <Routes>
          <Route path ="/" element= {<Home/>} exact/>
          <Route path ="/product/:id" element = {<ProductDetails/>} exact/>
          </Routes>
            
          </div>
        <Footer />
        </div>
    </Router>
    
  );
}

export default App;
