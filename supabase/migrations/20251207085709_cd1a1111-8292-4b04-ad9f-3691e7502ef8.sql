-- Add market_comments to realtime publication (if not already)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'market_comments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE market_comments;
  END IF;
END $$;

-- Set replica identity for realtime
ALTER TABLE market_comments REPLICA IDENTITY FULL;