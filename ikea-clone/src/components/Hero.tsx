import type { FC } from 'react';

const Hero: FC = () => {
  return (
    <section className="hero container">
      <img 
        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=2000" 
        alt="IKEA Showroom" 
      />
      <div className="hero-content">
        <h1>New low prices on your favorites</h1>
        <p>Make your home even better with our latest collection at affordable prices.</p>
        <button className="btn-primary">Shop now</button>
      </div>
    </section>
  );
};

export default Hero;
