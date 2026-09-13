import { useAuth } from "../context/AuthContext.jsx";

function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div className="container section-space">Please login to view your profile.</div>;
  }

  return (
    <section className="container section-space">
      <div className="glass-card profile-card">
        <h1>{user.name}</h1>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone || "Not provided"}</p>
        <p>Role: {user.role}</p>
      </div>
    </section>
  );
}

export default ProfilePage;
