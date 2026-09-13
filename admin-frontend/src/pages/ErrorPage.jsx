function ErrorPage() {
  return (
    <div className="admin-error-shell">
      <div className="admin-panel error-state">
        <span className="admin-kicker">Access issue</span>
        <h1>Page not found</h1>
        <p>The route you requested is unavailable or you do not have access.</p>
        <a className="admin-primary-button" href="/login">Go to login</a>
      </div>
    </div>
  );
}

export default ErrorPage;
