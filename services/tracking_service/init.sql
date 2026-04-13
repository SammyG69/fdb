CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tracked_meals (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id    UUID NOT NULL UNIQUE,
  user_id    TEXT NOT NULL,
  meal_type  TEXT NOT NULL,
  meal_date  DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meals (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        TEXT NOT NULL,
  meal_type      TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  created_at     TIMESTAMP NOT NULL DEFAULT now(),
  meal_date      DATE NOT NULL,
  total_calories INTEGER DEFAULT 0,
  total_protein  DOUBLE PRECISION DEFAULT 0,
  total_carbs    DOUBLE PRECISION DEFAULT 0,
  total_fats     DOUBLE PRECISION DEFAULT 0
);
