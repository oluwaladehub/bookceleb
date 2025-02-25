-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the celebrities table
CREATE TABLE IF NOT EXISTS celebrities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image TEXT,
  description TEXT,
  category TEXT,
  fee_range TEXT,
  availability BOOLEAN DEFAULT true,
  full_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the bookings table with nullable user_id
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  celebrity_id UUID NOT NULL REFERENCES celebrities(id) ON DELETE CASCADE,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  budget TEXT NOT NULL,
  event_type TEXT NOT NULL,
  location TEXT NOT NULL,
  message TEXT,
  full_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  gender TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  airport TEXT NOT NULL,
  full_description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  amount DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);