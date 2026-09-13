import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="container section-space text-center">
      <h1>404</h1>
      <p>The page you are trying to reach does not exist.</p>
      <Link to="/" className="primary-button">Go home</Link>
    </section>
  );
}

export default NotFoundPage;
