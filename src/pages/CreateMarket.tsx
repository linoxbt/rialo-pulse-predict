import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useCategories, useCreateMarket } from '@/hooks/useMarkets';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Sparkles, Calendar, Link as LinkIcon, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateMarket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [endDate, setEndDate] = useState('');
  const [resolutionSource, setResolutionSource] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [initialLiquidity, setInitialLiquidity] = useState('100');

  const { user, isAuthenticated } = useAuth();
  const { isConnected, connect, balance } = useWallet();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createMarket = useCreateMarket();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create a market.',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    if (!isConnected) {
      await connect();
      return;
    }

    if (!title || !description || !categoryId || !endDate || !resolutionSource) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const liquidity = parseFloat(initialLiquidity);
    if (liquidity > balance) {
      toast({
        title: 'Insufficient balance',
        description: 'You do not have enough RIA for the initial liquidity.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await createMarket.mutateAsync({
        title,
        description,
        category_id: categoryId,
        end_date: new Date(endDate).toISOString(),
        resolution_source: resolutionSource,
        image_url: imageUrl || undefined,
        creator_id: user.id,
        initialLiquidity: liquidity
      });

      toast({
        title: 'Market created!',
        description: 'Your prediction market is now live.'
      });

      navigate(`/market/${result.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create market. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            You need to be signed in to create a prediction market.
          </p>
          <Link to="/auth">
            <Button variant="wallet" size="lg">
              Sign In to Continue
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Markets</span>
      </Link>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Create Market</h1>
          <p className="text-muted-foreground">
            Create a new prediction market for the community to trade on.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl border border-border/50 p-6 card-gradient space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Market Question *</Label>
              <Input
                id="title"
                placeholder="Will Bitcoin reach $150K by end of 2025?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Frame as a yes/no question that can be objectively resolved.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Resolution Criteria *</Label>
              <Textarea
                id="description"
                placeholder="This market will resolve to Yes if the price of Bitcoin (BTC) reaches or exceeds $150,000 USD on any major exchange before December 31, 2025 11:59 PM UTC."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Describe exactly how and when this market will be resolved.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolutionSource">Resolution Source *</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="resolutionSource"
                  placeholder="https://coingecko.com/bitcoin"
                  value={resolutionSource}
                  onChange={(e) => setResolutionSource(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                URL or description of the source used to resolve this market.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.png"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liquidity">Initial Liquidity (RIA) *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="liquidity"
                  type="number"
                  placeholder="100"
                  value={initialLiquidity}
                  onChange={(e) => setInitialLiquidity(e.target.value)}
                  className="pl-10"
                  min="10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Minimum 10 RIA. Higher liquidity attracts more traders.
                {isConnected && ` Your balance: ${balance.toLocaleString()} RIA`}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button 
              type="submit" 
              disabled={createMarket.isPending}
              className="min-w-[140px]"
            >
              {createMarket.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Market
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
