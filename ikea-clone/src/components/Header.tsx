import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header>
      {/* Utility Bar */}
      <div className="utility-bar">
        <div className="container utility-container">
          <div className="utility-left">
            <div className="utility-link">
              <svg viewBox="0 0 24 24" focusable="false" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M13.7467 18.1766C12.9482 19.7737 12.2151 20 12 20c-.2151 0-.9482-.2263-1.7467-1.8234-.3065-.6131-.5745-1.3473-.7831-2.1766h5.0596c-.2086.8293-.4766 1.5635-.7831 2.1766zM14.8885 14h-5.777A17.7354 17.7354 0 0 1 9 12c0-.6949.0392-1.3641.1115-2h5.777c.0723.6359.1115 1.3051.1115 2 0 .6949-.0392 1.3641-.1115 2zm1.6955 2c-.2658 1.2166-.6492 2.307-1.1213 3.2138A8.0347 8.0347 0 0 0 18.9297 16H16.584zm3.164-2H16.9c.0656-.6462.1-1.3151.1-2 0-.6849-.0344-1.3538-.1-2h2.848A8.0156 8.0156 0 0 1 20 12a8.0156 8.0156 0 0 1-.252 2zm-.8183-6a8.035 8.035 0 0 0-3.467-3.2138c.4721.9068.8555 1.9972 1.1213 3.2138h2.3457zm-4.3999 0c-.2086-.8293-.4766-1.5635-.7831-2.1766C12.9482 4.2264 12.2151 4 12 4c-.2151 0-.9482.2263-1.7467 1.8234-.3065.613-.5745 1.3473-.7831 2.1766h5.0596zM7.416 8c.2658-1.2166.6491-2.307 1.1213-3.2138A8.035 8.035 0 0 0 5.0703 8H7.416zm-3.164 2A8.0147 8.0147 0 0 0 4 12c0 .6906.0875 1.3608.252 2H7.1a19.829 19.829 0 0 1-.1-2c0-.6849.0344-1.3538.1-2H4.252zm3.164 6H5.0704a8.0347 8.0347 0 0 0 3.467 3.2138C8.0651 18.307 7.6818 17.2166 7.4161 16zM22 12c0-5.5229-4.4772-10-10-10C6.4771 2 2 6.4771 2 12c0 5.5228 4.4771 10 10 10 5.5228 0 10-4.4772 10-10z"></path>
              </svg>
              EN
            </div>
            <div className="utility-link">
              Plan your perfect home with us
            </div>
          </div>
          <div className="utility-right">
            <div className="utility-link">
              <svg viewBox="0 0 24 24" focusable="false" fill="currentColor">
                <path fillRule="evenodd" clip-rule="evenodd" d="M1 4h15v3h3.0246l3.9793 5.6848V18h-2.6567c-.4218 1.3056-1.6473 2.25-3.0933 2.25-1.446 0-2.6715-.9444-3.0932-2.25h-3.9044c-.4217 1.3056-1.6472 2.25-3.0932 2.25S4.4916 19.3056 4.0698 18H1V4zm3.0698 12c.4218-1.3056 1.6473-2.25 3.0933-2.25 1.446 0 2.6715.9444 3.0932 2.25H14V6H3v10h1.0698zM16 14.0007a3.24 3.24 0 0 1 1.2539-.2507c1.446 0 2.6715.9444 3.0933 2.25h.6567v-2.6848L17.9833 9H16v5.0007zM7.163 15.75c-.6903 0-1.25.5596-1.25 1.25s.5597 1.25 1.25 1.25c.6904 0 1.25-.5596 1.25-1.25s-.5596-1.25-1.25-1.25zm10.0909 0c-.6904 0-1.25.5596-1.25 1.25s.5596 1.25 1.25 1.25 1.25-.5596 1.25-1.25-.5596-1.25-1.25-1.25z"></path>
              </svg>
              Enter postal code
            </div>
            <div className="utility-link">
              <svg viewBox="0 0 24 24" focusable="false" fill="currentColor">
                <path fillRule="evenodd" clip-rule="evenodd" d="M2 4v16h20V4H2zm2 4V6h16v2H4zm0 2v8h3v-6h10v6h3v-8H4zm11 4h-2v4h2v-4zm-4 0H9v4h2v-4z"></path>
              </svg>
              Select store
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container header-container">
          <div className="logo-container">
            <a href="#">
              <img src="https://www.ikea.com/global/assets/logos/brand/ikea.svg" alt="IKEA" />
            </a>
          </div>

          <nav className="nav-menu">
            <a href="#" className="nav-item">Products</a>
            <a href="#" className="nav-item">Rooms</a>
            <a href="#" className="nav-item">Offers</a>
            <a href="#" className="nav-item">Inspiration</a>
            <a href="#" className="nav-item">Design/Support</a>
          </nav>

          <div className="search-wrapper">
            <span className="search-icon-inside">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input type="text" placeholder="What are you looking for?" />
          </div>

          <div className="header-actions">
            <button className="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Hej! Log in</span>
            </button>
            <button className="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.82-8.82 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              <span>Favorites</span>
            </button>
            <button className="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              <span>Bag</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
