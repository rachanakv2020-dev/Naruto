-- Users
INSERT INTO users (name, email, password_hash, phone, role)
VALUES
  ('Naruto Uzumaki', 'naruto@example.com', '$2a$10$8K1p/a0dL1LQ1y1uQK7f4O7Si8Qf4Gk3k2i1j3wYI4/3pP8E0tX2', '9876543210', 'user'),
  ('Sakura Haruno', 'sakura@example.com', '$2a$10$8K1p/a0dL1LQ1y1uQK7f4O7Si8Qf4Gk3k2i1j3wYI4/3pP8E0tX2', '9876543211', 'user'),
  ('Hokage Admin', 'admin@leafvillage.com', '$2a$10$8K1p/a0dL1LQ1y1uQK7f4O7Si8Qf4Gk3k2i1j3wYI4/3pP8E0tX2', '9876543212', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO admins (user_id)
SELECT id FROM users WHERE email = 'admin@leafvillage.com'
ON CONFLICT (user_id) DO NOTHING;

-- Restaurants
INSERT INTO restaurants (name, slug, description, cuisine, rating, delivery_time, delivery_fee, image, is_active)
VALUES
  ('Hidden Leaf Grill', 'hidden-leaf-grill', 'Fresh grilled meals inspired by village favorites.', 'Japanese', 4.8, '25-35 min', 30.00, 'https://images.unsplash.com/photo-1552566626-52f8b828add9', true),
  ('Ramen Dojo', 'ramen-dojo', 'Comfort bowls, bold broths, and quick delivery.', 'Ramen', 4.9, '20-30 min', 25.00, 'https://images.unsplash.com/photo-1547592180-85f173990554', true),
  ('Sakura Sushi', 'sakura-sushi', 'Fresh sushi, rolls, and healthy Japanese bites.', 'Sushi', 4.7, '30-40 min', 35.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', true),
  ('Konoha Kebab House', 'konoha-kebab-house', 'Tandoori favorites and spiced wraps for every ninja.', 'Indian', 4.6, '25-35 min', 20.00, 'https://images.unsplash.com/photo-1544025162-d76694265947', true)
ON CONFLICT (slug) DO NOTHING;

-- Categories
INSERT INTO categories (name, image)
SELECT source.name, source.image
FROM (VALUES
  ('Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd'),
  ('Noodles', 'https://images.unsplash.com/photo-1557872943-16a5ac26437e'),
  ('Sushi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'),
  ('Desserts', 'https://images.unsplash.com/photo-1551024601-bec78aea704b'),
  ('Beverages', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2e6')
) AS source(name, image)
WHERE NOT EXISTS (
  SELECT 1 FROM categories existing WHERE LOWER(existing.name) = LOWER(source.name)
);

-- Foods (demo items)
INSERT INTO foods (restaurant_id, category_id, name, description, price, image, is_available, spicy, featured)
VALUES
  (1, 1, 'Leaf Village Burger', 'Crispy chicken burger with house sauce and crunchy slaw.', 220.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', true, false, true),
  (1, 1, 'Shadow Burger', 'Double patty burger with cheddar and grilled onion.', 280.00, 'https://images.unsplash.com/photo-1550317138-10000687a72b', true, true, false),
  (2, 2, 'Ramen Sensei Bowl', 'Rich miso ramen with soft noodles and roasted vegetables.', 260.00, 'https://images.unsplash.com/photo-1557872943-16a5ac26437e', true, false, true),
  (2, 2, 'Spicy Konoha Ramen', 'Spicy broth, tofu, egg, and chili oil finish.', 310.00, 'https://images.unsplash.com/photo-1645112411341-6c8d4d5d2876', true, true, false),
  (3, 3, 'Sunrise Sushi Combo', 'Fresh salmon, tuna, and avocado rolls.', 340.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c', true, false, true),
  (3, 3, 'Crunch Roll', 'Crispy tempura shrimp roll with spicy mayo.', 320.00, 'https://images.unsplash.com/photo-1611143669185-af224c5e3252', true, true, false),
  (4, 1, 'Kebab Platter', 'Skewered kebabs with garlic rice and salad.', 290.00, 'https://images.unsplash.com/photo-1544025162-d76694265947', true, false, true),
  (4, 1, 'Chili Wrap', 'Loaded wrap with grilled chicken, herbs, and chili sauce.', 240.00, 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783', true, true, false),
  (1, 4, 'Moon Cake Dessert', 'Soft dessert with warm caramel and cream.', 180.00, 'https://images.unsplash.com/photo-1551024601-bec78aea704b', true, false, false),
  (2, 5, 'Green Tea Soda', 'Refreshing chilled tea with citrus notes.', 120.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2e6', true, false, false)
ON CONFLICT DO NOTHING;

-- Empty cart row for sample user
INSERT INTO cart (user_id)
SELECT id FROM users WHERE email = 'naruto@example.com'
ON CONFLICT DO NOTHING;
