import type { FC } from 'react';

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  image: string;
}

const ProductCard: FC<ProductCardProps> = ({ name, description, price, image }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
        <button className="btn-cart" aria-label="Add to cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        </button>
      </div>
      <div className="product-info">
        <h3>{name}</h3>
        <p className="product-desc">{description}</p>
        <div className="product-price">
          <span className="currency">Rs.</span>
          <span>{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
