import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Send, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile?: {
    username: string | null;
    avatar_url: string | null;
  };
}

interface MarketCommentsProps {
  marketId: string;
}

export function MarketComments({ marketId }: MarketCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchComments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('market-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'market_comments',
          filter: `market_id=eq.${marketId}`
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [marketId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('market_comments')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles:user_id (
          username,
          avatar_url
        )
      `)
      .eq('market_id', marketId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      const formattedComments = data?.map(comment => ({
        ...comment,
        profile: Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles
      })) || [];
      setComments(formattedComments);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('market_comments')
      .insert({
        market_id: marketId,
        user_id: user.id,
        content: newComment.trim()
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive'
      });
    } else {
      setNewComment('');
      toast({
        title: 'Comment posted',
        description: 'Your comment has been added'
      });
    }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string) => {
    const { error } = await supabase
      .from('market_comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Comment deleted',
        description: 'Your comment has been removed'
      });
    }
  };

  const getInitials = (username: string | null) => {
    if (!username) return '?';
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Discussion ({comments.length})
      </h2>

      {/* Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Textarea
            placeholder="Share your thoughts on this market..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3 resize-none"
            rows={3}
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Post Comment
          </Button>
        </form>
      ) : (
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Sign in to join the discussion
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-secondary" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-secondary rounded" />
                <div className="h-12 w-full bg-secondary rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No comments yet</p>
          <p className="text-sm text-muted-foreground/70">Be the first to share your thoughts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-primary/20 text-primary">
                  {getInitials(comment.profile?.username)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {comment.profile?.username || 'Anonymous'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
