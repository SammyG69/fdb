CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS tracked_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    meal_date DATE NOT NULL,
    logged_at TIMESTAMP NOT NULL DEFAULT NOW(),

    source_type TEXT NOT NULL CHECK (source_type IN ('manual', 'saved_meal')) DEFAULT 'manual',
    source_saved_meal_id UUID NULL,

    total_calories NUMERIC(10,2) DEFAULT 0,
    total_protein NUMERIC(10,2) DEFAULT 0,
    total_carbs NUMERIC(10,2) DEFAULT 0,
    total_fats NUMERIC(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tracked_meal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracked_meal_id UUID NOT NULL REFERENCES tracked_meals(id) ON DELETE CASCADE,
    food_id UUID NOT NULL,
    quantity NUMERIC(10,2) NOT NULL,
    unit TEXT DEFAULT 'g',

    calories NUMERIC(10,2) DEFAULT 0,
    protein NUMERIC(10,2) DEFAULT 0,
    carbs NUMERIC(10,2) DEFAULT 0,
    fats NUMERIC(10,2) DEFAULT 0
);
