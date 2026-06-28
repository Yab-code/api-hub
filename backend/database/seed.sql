-- 1. SEED ROLES
INSERT INTO roles (id, name) VALUES
('ad000000-0000-0000-0000-000000000000', 'admin'),
('de000000-0000-0000-0000-000000000000', 'developer'),
('gu000000-0000-0000-0000-000000000000', 'guest')
ON CONFLICT (name) DO NOTHING;

-- 2. SEED USERS
-- Password: password
-- Hash: $2b$10$9kQ8RL6/cCpld0Ed5EHeT.0zKd/yMByLPNBEcc5OvyV7JfO1KDjsq
INSERT INTO users (id, role_id, name, email, password_hash, plan, api_key_count, avatar, bio) VALUES
('11111111-1111-1111-1111-111111111111', 'ad000000-0000-0000-0000-000000000000', 'Admin User', 'admin@apihub.com', '$2b$10$9kQ8RL6/cCpld0Ed5EHeT.0zKd/yMByLPNBEcc5OvyV7JfO1KDjsq', 'Enterprise', 15, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5', 'System administrator for APIHub Core Services.'),
('22222222-2222-2222-2222-222222222222', 'de000000-0000-0000-0000-000000000000', 'Developer User', 'developer@company.com', '$2b$10$9kQ8RL6/cCpld0Ed5EHeT.0zKd/yMByLPNBEcc5OvyV7JfO1KDjsq', 'Pro', 4, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3gok_o0DtLEC3m0jbNL_quGIbn6A-HacR4g9oxWeILFiwglfhBUr4vNTbxkIBdI0NpDARa3PU3xJmKKr4Al6rm_3jkKqpmEhgbOkb1N3x00s6DKL2X5DhSTUD6gkWzbL8aVS8eLGgUGJufK6kjV1aXlfuXCkSlTxEYSvEz8TvJ_8kpkv4Zl8E6lq2Vwvo2fKpRcl9-bVs78_JtqjKubxECUmy06wizaq_kdDZY8UCpnp1NECGq3o1-I3phOYxRCPbEmneSiNetsL5', 'Full-stack software developer.')
ON CONFLICT (email) DO NOTHING;

-- 3. SEED CATEGORIES
INSERT INTO categories (id, name) VALUES
('c1111111-1111-1111-1111-111111111111', 'Payment'),
('c2222222-2222-2222-2222-222222222222', 'Artificial Intelligence'),
('c3333333-3333-3333-3333-333333333333', 'Data'),
('c4444444-4444-4444-4444-444444444444', 'Messaging')
ON CONFLICT (name) DO NOTHING;

-- 4. SEED APIS
INSERT INTO apis (id, category_id, name, description, logo, base_url, uptime, rating, status, version, creator_id) VALUES
('a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'Payment Gateway Pro', 'Process credit cards, manage subscriptions, and send payouts globally.', 'https://img.icons8.com/color/96/000000/stripe.png', 'https://api.stripe.com', '99.98%', 4.8, 'active', 'v2.4.0', '11111111-1111-1111-1111-111111111111'),
('a2222222-2222-2222-2222-222222222222', 'c2222222-2222-2222-2222-222222222222', 'AI Inference Engine', 'Generate human-like text, translations, and complete programming tasks.', 'https://img.icons8.com/color/96/000000/openai.png', 'https://api.openai.com', '99.91%', 4.9, 'active', 'v3.0.0', '11111111-1111-1111-1111-111111111111'),
('a3333333-3333-3333-3333-333333333333', 'c3333333-3333-3333-3333-333333333333', 'User Discovery API', 'Query user profiles, active keys, and developer meta data structures.', 'https://img.icons8.com/color/96/000000/user-groups.png', 'https://api.github.com', '100.00%', 4.6, 'active', 'v1.2.3', '22222222-2222-2222-2222-222222222222'),
('a4444444-4444-4444-4444-444444444444', 'c4444444-4444-4444-4444-444444444444', 'Legacy Auth Service', 'Provides session management tokens and OAuth callback verification.', 'https://img.icons8.com/color/96/000000/key.png', 'https://api.auth0.com', '98.50%', 3.2, 'deprecated', 'v0.9.1', '11111111-1111-1111-1111-111111111111'),
('a5555555-5555-5555-5555-555555555555', 'c3333333-3333-3333-3333-333333333333', 'Storage Blob API', 'Upload large objects, media files, and archive assets securely.', 'https://img.icons8.com/color/96/000000/google-drive.png', 'https://api.google.com/storage', '99.95%', 4.5, 'active', 'v2.1.0', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED FAVORITES
INSERT INTO favorites (user_id, api_id) VALUES
('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111'),
('22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- 6. SEED COLLECTIONS
INSERT INTO collections (id, user_id, name, description) VALUES
('col11111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Core Services', 'APIs powering essential platform operations.'),
('col22222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Integrations Hub', 'Secondary payment and storage gateways.')
ON CONFLICT DO NOTHING;

-- 7. SEED COLLECTION_APIS
INSERT INTO collection_apis (collection_id, api_id) VALUES
('col11111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111'),
('col11111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222'),
('col22222-2222-2222-2222-222222222222', 'a5555555-5555-5555-5555-555555555555')
ON CONFLICT DO NOTHING;

-- 8. SEED REVIEWS
INSERT INTO reviews (user_id, api_id, rating, comment) VALUES
('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 5, 'Excellent API! Documentation is clear and response times are blazing fast.'),
('11111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 4, 'Great integration experience. Minor issues with rate limiting documentation.')
ON CONFLICT DO NOTHING;

-- 9. SEED NOTIFICATIONS
INSERT INTO notifications (user_id, title, message) VALUES
('22222222-2222-2222-2222-222222222222', 'Welcome to APIHub!', 'Start searching, saving, and testing developer APIs right away.'),
('22222222-2222-2222-2222-222222222222', 'Quota Alert', 'You are currently at 85% of your sandbox daily request quota.')
ON CONFLICT DO NOTHING;

-- 10. SEED REQUEST HISTORY
INSERT INTO request_history (user_id, api_id, method, endpoint, status, latency) VALUES
('22222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'POST', '/v1/charges', 200, 142),
('22222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'POST', '/v1/completions', 200, 480),
('22222222-2222-2222-2222-222222222222', 'a4444444-4444-4444-4444-444444444444', 'GET', '/v1/legacy/sync', 502, 1205)
ON CONFLICT DO NOTHING;
