import type { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Join IKEA Family</h4>
            <p style={{fontSize: '0.875rem', marginBottom: '1.5rem', color: '#484848'}}>
              Get exclusive member-only discounts and inspiration.
            </p>
            <button className="btn-primary" style={{backgroundColor: '#111111'}}>Join now</button>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li>Customer Service</li>
              <li>Track my order</li>
              <li>Return policy</li>
              <li>Warranties</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>About IKEA</h4>
            <ul>
              <li>This is IKEA</li>
              <li>Sustainability</li>
              <li>Working at IKEA</li>
              <li>Newsroom</li>
              <li>IKEA Museum</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>Delivery Service</li>
              <li>Installation Service</li>
              <li>Kitchen Planning</li>
              <li>Personalized Interior Design</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© Inter IKEA Systems B.V. 1999-2024</p>
          <div style={{display: 'flex', gap: '1.5rem'}}>
            <span>Privacy Policy</span>
            <span>Cookie Policy</span>
            <span>Terms and Conditions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
