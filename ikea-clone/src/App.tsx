import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import Footer from './components/Footer';

const sampleProducts = [
  {
    id: 1,
    name: 'MALM',
    description: 'Bed frame, high, w 2 storage boxes, white',
    price: '18,990',
    image: 'https://www.ikea.com/in/en/images/products/malm-bed-frame-high-w-2-storage-boxes-white__0638608_pe699032_s5.jpg?f=xxs'
  },
  {
    id: 2,
    name: 'KALLAX',
    description: 'Shelving unit, white, 77x147 cm',
    price: '5,990',
    image: 'https://www.ikea.com/in/en/images/products/kallax-shelving-unit-white__0644757_pe702939_s5.jpg?f=xxs'
  },
  {
    id: 3,
    name: 'POÄNG',
    description: 'Armchair, birch veneer/Knisa light beige',
    price: '7,990',
    image: 'https://www.ikea.com/in/en/images/products/poaeng-armchair-birch-veneer-knisa-light-beige__0571352_pe666909_s5.jpg?f=xxs'
  },
  {
    id: 4,
    name: 'LACK',
    description: 'Side table, white, 55x55 cm',
    price: '799',
    image: 'https://www.ikea.com/in/en/images/products/lack-side-table-white__0702208_pe724343_s5.jpg?f=xxs'
  },
  {
    id: 5,
    name: 'HEMNES',
    description: 'Day-bed frame with 3 drawers, white',
    price: '29,990',
    image: 'https://www.ikea.com/in/en/images/products/hemnes-day-bed-frame-with-3-drawers-white__0637568_pe698418_s5.jpg?f=xxs'
  },
  {
    id: 6,
    name: 'BILLY',
    description: 'Bookcase, white, 80x28x202 cm',
    price: '4,990',
    image: 'https://www.ikea.com/in/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg?f=xxs'
  },
  {
    id: 7,
    name: 'FRIHETEN',
    description: 'Corner sofa-bed with storage, Skiftebo dark grey',
    price: '45,990',
    image: 'https://www.ikea.com/in/en/images/products/friheten-corner-sofa-bed-with-storage-skiftebo-dark-grey__0175610_pe328883_s5.jpg?f=xxs'
  },
  {
    id: 8,
    name: 'NORDLI',
    description: 'Chest of 3 drawers, white, 40x76 cm',
    price: '12,000',
    image: 'https://www.ikea.com/in/en/images/products/nordli-chest-of-3-drawers-white__0645167_pe703272_s5.jpg?f=xxs'
  }
];

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        
        <section className="product-section container">
          <h2 className="section-title">New at IKEA</h2>
          <div className="product-grid">
            {sampleProducts.map(product => (
              <ProductCard 
                key={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>

        <section className="product-section container">
          <h2 className="section-title">Trending Now</h2>
          <div className="product-grid">
            {sampleProducts.slice(0, 4).reverse().map(product => (
              <ProductCard 
                key={`trending-${product.id}`}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
