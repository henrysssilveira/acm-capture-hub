-- Create newsletter contacts table
CREATE TABLE public.newsletter_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_email UNIQUE (email)
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (sign up for newsletter)
CREATE POLICY "Anyone can insert newsletter contact"
ON public.newsletter_contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: No one can select without authentication (protect PII data)
-- This will be updated later when admin access is needed
CREATE POLICY "No public select on newsletter contacts"
ON public.newsletter_contacts
FOR SELECT
TO authenticated
USING (false);

-- Add index for email lookups
CREATE INDEX idx_newsletter_contacts_email ON public.newsletter_contacts(email);

-- Add index for created_at for sorting
CREATE INDEX idx_newsletter_contacts_created_at ON public.newsletter_contacts(created_at DESC);