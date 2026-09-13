import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function HeroBanner() {
  return (
    <section className="hero-section">
      <div className="container hero-layout">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="eyebrow">Hidden Leaf delivery</span>
          <h1>Fuel your next mission with bold village flavors.</h1>
          <p>
            Discover handcrafted ramen, fresh sushi, juicy burgers, and comfort food from the best local kitchens.
          </p>

          <div className="hero-actions">
            <Link to="/restaurants" className="primary-button">Explore restaurants</Link>
            <Link to="/orders" className="secondary-button">Track orders</Link>
          </div>

          <div className="stats-row">
            <div>
              <strong>25k+</strong>
              <span>Orders</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Rating</span>
            </div>
            <div>
              <strong>15 min</strong>
              <span>Average prep</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="food-card-preview">
            <img
              src="https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=800&q=80"
              alt="Ramen bowl"
            />
            <div className="floating-tag">Bestseller</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroBanner;
