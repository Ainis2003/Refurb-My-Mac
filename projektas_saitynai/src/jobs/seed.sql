BEGIN;

-- OPTIONAL: clear existing data if you want a clean seed each run
-- TRUNCATE "repairs", "computer_repairmen", "computers", "model_allowed_ssd", "model_allowed_ram",
--          "shipments", "models", "makes", "ram_options", "ssd_options",
--          refresh_token, app_user
-- RESTART IDENTITY CASCADE;

-------------------------
-- Users & Auth
-------------------------
INSERT INTO app_user (username, password, role, deleted)
VALUES
  ('admin',        'password123', 'Admin',      FALSE),
  ('sam.fix',      'password123', 'Repairman',  FALSE),
  ('jess.tools',   'password123', 'Repairman',  FALSE),
  ('mike.boards',  'password123', 'Repairman',  FALSE)
ON CONFLICT (username) DO NOTHING;

-- A couple of refresh tokens (mock values & expiries)
INSERT INTO refresh_token (user_id, token, expires_at)
VALUES
  ((SELECT id FROM app_user WHERE username = 'admin'),       'tok_admin_001',  NOW() + INTERVAL '30 days'),
  ((SELECT id FROM app_user WHERE username = 'sam.fix'),     'tok_sam_001',    NOW() + INTERVAL '15 days'),
  ((SELECT id FROM app_user WHERE username = 'jess.tools'),  'tok_jess_001',   NOW() + INTERVAL '15 days')
ON CONFLICT (token) DO NOTHING;

-------------------------
-- Makes / Models
-------------------------
INSERT INTO "makes" ("name") VALUES
  ('Apple'),
  ('Dell'),
  ('Lenovo'),
  ('HP')
ON CONFLICT ("name") DO NOTHING;

-- Models per make
INSERT INTO "models" ("make_id","name")
VALUES
  ((SELECT id FROM "makes" WHERE name='Apple'),  'MacBook Pro 14'),
  ((SELECT id FROM "makes" WHERE name='Apple'),  'MacBook Air 13'),
  ((SELECT id FROM "makes" WHERE name='Dell'),   'XPS 13'),
  ((SELECT id FROM "makes" WHERE name='Dell'),   'Latitude 5440'),
  ((SELECT id FROM "makes" WHERE name='Lenovo'), 'ThinkPad T14'),
  ((SELECT id FROM "makes" WHERE name='Lenovo'), 'ThinkPad X1 Carbon'),
  ((SELECT id FROM "makes" WHERE name='HP'),     'EliteBook 840'),
  ((SELECT id FROM "makes" WHERE name='HP'),     'ProBook 450')
ON CONFLICT DO NOTHING;

-------------------------
-- RAM / SSD options
-------------------------
INSERT INTO "ram_options" ("label","gb") VALUES
  ('8 GB', 8),
  ('16 GB', 16),
  ('32 GB', 32),
  ('64 GB', 64)
ON CONFLICT ("label") DO NOTHING;

INSERT INTO "ssd_options" ("label","gb") VALUES
  ('256 GB', 256),
  ('512 GB', 512),
  ('1 TB', 1024),
  ('2 TB', 2048)
ON CONFLICT ("label") DO NOTHING;

-------------------------
-- Allowable combos per model
-------------------------
-- Helper: allow a broad set for each model
WITH m AS (
  SELECT id, name FROM models
)
INSERT INTO model_allowed_ram (model_id, ram_option_id)
SELECT m.id,
       r.id
FROM m
JOIN ram_options r
  ON r.gb IN (8,16,32,64)
ON CONFLICT DO NOTHING;

WITH m AS (
  SELECT id, name FROM models
)
INSERT INTO model_allowed_ssd (model_id, ssd_option_id)
SELECT m.id,
       s.id
FROM m
JOIN ssd_options s
  ON s.gb IN (256,512,1024,2048)
ON CONFLICT DO NOTHING;

-------------------------
-- Shipments
-------------------------
INSERT INTO "shipments" ("tracking_number","supplier_name","date_sent","date_received","cost_send","cost_receive","note")
VALUES
  ('LT-TRACK-0001', 'Baltic Suppliers UAB',  CURRENT_DATE - INTERVAL '40 days', CURRENT_DATE - INTERVAL '36 days', 12.50, 0, 'Initial bulk order'),
  ('LT-TRACK-0002', 'Parts&More OU',         CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE - INTERVAL '17 days', 10.00, 0, 'SSDs & RAM'),
  ('LT-TRACK-0003', 'TechImport SIA',        CURRENT_DATE - INTERVAL '8 days',  NULL,                               9.75, 0, 'Still in transit')
ON CONFLICT ("tracking_number") DO NOTHING;

-------------------------
-- Computers (inventory)
-------------------------
-- A few Apple
INSERT INTO "computers"
  ("model_id","ram_option_id","ssd_option_id","purchase_price","purchase_date","sold_price","sold_date","status","primary_repairman_id","note","qr_code")
VALUES
  ((SELECT id FROM models WHERE name='MacBook Pro 14'),
   (SELECT id FROM ram_options WHERE label='16 GB'),
   (SELECT id FROM ssd_options WHERE label='512 GB'),
   1350.00, CURRENT_DATE - INTERVAL '35 days', NULL, NULL,
   'not yet repaired',
   (SELECT id FROM app_user WHERE username='sam.fix'),
   'Liquid damage, needs keyboard replacement',
   'QR-APPLE-MBP14-0001'),

  ((SELECT id FROM models WHERE name='MacBook Air 13'),
   (SELECT id FROM ram_options WHERE label='8 GB'),
   (SELECT id FROM ssd_options WHERE label='256 GB'),
   820.00, CURRENT_DATE - INTERVAL '28 days', NULL, NULL,
   'waiting for parts',
   (SELECT id FROM app_user WHERE username='jess.tools'),
   'Faint lines on display, waiting for panel',
   'QR-APPLE-MBA13-0002');

-- A few Dell
INSERT INTO "computers"
  ("model_id","ram_option_id","ssd_option_id","purchase_price","purchase_date","sold_price","sold_date","status","primary_repairman_id","note","qr_code")
VALUES
  ((SELECT id FROM models WHERE name='XPS 13'),
   (SELECT id FROM ram_options WHERE label='16 GB'),
   (SELECT id FROM ssd_options WHERE label='1 TB'),
   980.00, CURRENT_DATE - INTERVAL '22 days', NULL, NULL,
   'repaired waiting for listing',
   (SELECT id FROM app_user WHERE username='mike.boards'),
   'Replaced battery and fans',
   'QR-DELL-XPS13-0003'),

  ((SELECT id FROM models WHERE name='Latitude 5440'),
   (SELECT id FROM ram_options WHERE label='32 GB'),
   (SELECT id FROM ssd_options WHERE label='512 GB'),
   760.00, CURRENT_DATE - INTERVAL '18 days', 1099.00, CURRENT_DATE - INTERVAL '2 days',
   'sold',
   (SELECT id FROM app_user WHERE username='sam.fix'),
   'Corporate off-lease unit; very clean',
   'QR-DELL-LAT5440-0004');

-- A few Lenovo
INSERT INTO "computers"
  ("model_id","ram_option_id","ssd_option_id","purchase_price","purchase_date","sold_price","sold_date","status","primary_repairman_id","note","qr_code")
VALUES
  ((SELECT id FROM models WHERE name='ThinkPad T14'),
   (SELECT id FROM ram_options WHERE label='16 GB'),
   (SELECT id FROM ssd_options WHERE label='512 GB'),
   700.00, CURRENT_DATE - INTERVAL '26 days', NULL, NULL,
   'listed',
   (SELECT id FROM app_user WHERE username='jess.tools'),
   'Grade A keyboard, tiny chassis scuffs',
   'QR-LENOVO-T14-0005'),

  ((SELECT id FROM models WHERE name='ThinkPad X1 Carbon'),
   (SELECT id FROM ram_options WHERE label='32 GB'),
   (SELECT id FROM ssd_options WHERE label='1 TB'),
   1150.00, CURRENT_DATE - INTERVAL '14 days', NULL, NULL,
   'repaired waiting for listing',
   (SELECT id FROM app_user WHERE username='mike.boards'),
   'Thermal paste & fan service done',
   'QR-LENOVO-X1C-0006');

-- A few HP
INSERT INTO "computers"
  ("model_id","ram_option_id","ssd_option_id","purchase_price","purchase_date","sold_price","sold_date","status","primary_repairman_id","note","qr_code")
VALUES
  ((SELECT id FROM models WHERE name='EliteBook 840'),
   (SELECT id FROM ram_options WHERE label='16 GB'),
   (SELECT id FROM ssd_options WHERE label='256 GB'),
   620.00, CURRENT_DATE - INTERVAL '12 days', NULL, NULL,
   'bought',
   (SELECT id FROM app_user WHERE username='sam.fix'),
   'Boot loop observed; likely NVMe issue',
   'QR-HP-EB840-0007'),

  ((SELECT id FROM models WHERE name='ProBook 450'),
   (SELECT id FROM ram_options WHERE label='8 GB'),
   (SELECT id FROM ssd_options WHERE label='256 GB'),
   450.00, CURRENT_DATE - INTERVAL '10 days', NULL, NULL,
   'has problems',
   (SELECT id FROM app_user WHERE username='jess.tools'),
   'USB-C port intermittent; board inspection pending',
   'QR-HP-PB450-0008');

-------------------------
-- Computer ↔ Repairmen mapping
-------------------------
-- Make sure each computer has its primary repairman flagged here too
INSERT INTO "computer_repairmen" ("computer_id","repairman_id","assigned_at","is_primary")
SELECT c.id,
       u.id,
       NOW() - INTERVAL '30 days',
       TRUE
FROM computers c
JOIN app_user u
  ON u.id = c.primary_repairman_id
ON CONFLICT DO NOTHING;

-- Add a few secondary assignments
INSERT INTO "computer_repairmen" ("computer_id","repairman_id","assigned_at","is_primary")
VALUES
  ((SELECT id FROM computers WHERE qr_code='QR-APPLE-MBP14-0001'),
   (SELECT id FROM app_user WHERE username='jess.tools'),
   NOW() - INTERVAL '20 days',
   FALSE),
  ((SELECT id FROM computers WHERE qr_code='QR-DELL-XPS13-0003'),
   (SELECT id FROM app_user WHERE username='sam.fix'),
   NOW() - INTERVAL '12 days',
   FALSE)
ON CONFLICT DO NOTHING;

-------------------------
-- Repairs
-------------------------
-- In-progress / completed repairs
INSERT INTO "repairs"
  ("computer_id","repairman_id","description","notes","cost","hours","shipment_id","created_at","marked_complete","approved","admin_id","admin_comment","approved_at")
VALUES
  (
    (SELECT id FROM computers WHERE qr_code='QR-APPLE-MBP14-0001'),
    (SELECT id FROM app_user WHERE username='sam.fix'),
    'Keyboard & topcase replacement',
    'Liquid ingress around JIS area. Cleaned & replaced topcase.',
    165.00, 2.50,
    (SELECT id FROM shipments WHERE tracking_number='LT-TRACK-0002'),
    NOW() - INTERVAL '27 days',
    TRUE, TRUE,
    (SELECT id FROM app_user WHERE username='admin'),
    'Good job, margins OK.',
    NOW() - INTERVAL '25 days'
  ),
  (
    (SELECT id FROM computers WHERE qr_code='QR-APPLE-MBA13-0002'),
    (SELECT id FROM app_user WHERE username='jess.tools'),
    'LCD panel replacement',
    'Waiting on panel; ETA 5–7 days.',
    0.00, 0.50,
    (SELECT id FROM shipments WHERE tracking_number='LT-TRACK-0003'),
    NOW() - INTERVAL '7 days',
    FALSE, NULL,
    (SELECT id FROM app_user WHERE username='admin'),
    NULL,
    NULL
  ),
  (
    (SELECT id FROM computers WHERE qr_code='QR-DELL-XPS13-0003'),
    (SELECT id FROM app_user WHERE username='mike.boards'),
    'Battery + fan swap',
    'Replaced both fans and a swollen battery; thermal paste applied.',
    85.25, 1.75,
    (SELECT id FROM shipments WHERE tracking_number='LT-TRACK-0002'),
    NOW() - INTERVAL '15 days',
    TRUE, TRUE,
    (SELECT id FROM app_user WHERE username='admin'),
    'List it tomorrow.',
    NOW() - INTERVAL '14 days'
  ),
  (
    (SELECT id FROM computers WHERE qr_code='QR-LENOVO-X1C-0006'),
    (SELECT id FROM app_user WHERE username='mike.boards'),
    'Thermal service',
    'Fan cleaned, new paste. Running cool.',
    12.00, 0.80,
    NULL,
    NOW() - INTERVAL '6 days',
    TRUE, TRUE,
    (SELECT id FROM app_user WHERE username='admin'),
    'Looks great',
    NOW() - INTERVAL '5 days'
  ),
  (
    (SELECT id FROM computers WHERE qr_code='QR-HP-PB450-0008'),
    (SELECT id FROM app_user WHERE username='jess.tools'),
    'USB-C port diagnosis',
    'Port intermittent; likely connector or PD controller.',
    0.00, 0.40,
    NULL,
    NOW() - INTERVAL '3 days',
    FALSE, NULL,
    (SELECT id FROM app_user WHERE username='admin'),
    NULL,
    NULL
  )
ON CONFLICT DO NOTHING;

COMMIT;