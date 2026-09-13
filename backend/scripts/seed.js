const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const fs = require("fs");
const path = require("path");

const seedAdmin = async () => {
  const email = "admin@leafvillage.com";
  const password = "admin123";
  const hash = await bcrypt.hash(password, 10);

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rows.length === 0) {
    const user = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id`,
      ["Hokage Admin", email, hash]
    );

    await pool.query(
      `INSERT INTO admins (user_id)
       VALUES ($1)`,
      [user.rows[0].id]
    );

    console.log("✅ Admin seed created successfully.");
  } else {
    await pool.query(
      `UPDATE users
       SET password_hash = $1, role = 'admin'
       WHERE email = $2`,
      [hash, email]
    );

    console.log("✅ Admin credentials synchronized successfully.");
  }
};

const seedDemoData = async () => {
  const sql = fs.readFileSync(path.join(__dirname, "../../database/seed.sql"), "utf8");
  await pool.query(sql);
  console.log("✅ SQL seed data imported.");
};

(async () => {
  try {
    await seedAdmin();
    await seedDemoData();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
})();
