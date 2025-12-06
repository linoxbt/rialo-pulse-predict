import { cn } from "@/lib/utils";
import { Category } from "@/types/market";
import { 
  LayoutGrid, 
  Bitcoin, 
  Vote, 
  Trophy, 
  Film, 
  Cpu, 
  FlaskConical, 
  TrendingUp 
} from "lucide-react";

interface CategoryTabsProps {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
}

const categories: { id: Category; label: string; icon: typeof LayoutGrid }[] = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "crypto", label: "Crypto", icon: Bitcoin },
  { id: "politics", label: "Politics", icon: Vote },
  { id: "sports", label: "Sports", icon: Trophy },
  { id: "entertainment", label: "Entertainment", icon: Film },
  { id: "tech", label: "Tech", icon: Cpu },
  { id: "science", label: "Science", icon: FlaskConical },
  { id: "economics", label: "Economics", icon: TrendingUp },
];

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
          )}
        >
          <category.icon className="w-4 h-4" />
          {category.label}
        </button>
      ))}
    </div>
  );
}
