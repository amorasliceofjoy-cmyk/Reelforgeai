import React from "react";
import { AppleCard } from "../shared/AppleCard";
import { AppleButton } from "../shared/AppleButton";
import { Video, Utensils, Briefcase, ShoppingBag, Sparkles } from "lucide-react";

type CategorySelectProps = {
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
};

const CATEGORIES = [
  {
    id: "food_vlogger",
    label: "Food Vlogger",
    description: "Recipes, behind-the-scenes, food aesthetics",
    icon: Utensils,
  },
  {
    id: "business_owner",
    label: "Business Owner",
    description: "Education, authority, client stories, offer explainers",
    icon: Briefcase,
  },
  {
    id: "content_creator",
    label: "Content Creator",
    description: "Trends, storytelling, educational content",
    icon: Sparkles,
  },
  {
    id: "product_seller",
    label: "Product Seller",
    description: "Unboxing, demos, before/after, reviews",
    icon: ShoppingBag,
  },
];

export const CategorySelect: React.FC<CategorySelectProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="min-h-screen bg-[#F7F7F8]">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-[#1B1B1E] flex items-center gap-2">
              <Video className="w-7 h-7 text-[#007AFF]" />
              Choose Your Creator Category
            </h1>
            <p className="text-sm text-[#63636A] mt-1">
              This will help AI shape the tone and structure of your reel script.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.label;
            return (
              <AppleCard
                key={cat.id}
                hover
                className={`p-5 cursor-pointer border-2 transition-all ${
                  isActive ? "border-[#007AFF] shadow-md" : "border-transparent"
                }`}
                onClick={() => onSelectCategory(cat.label)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#007AFF]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#007AFF]" />
                  </div>
                </div>
                <h3 className="font-semibold text-[#1B1B1E] mb-1">
                  {cat.label}
                </h3>
                <p className="text-xs text-[#63636A]">{cat.description}</p>
              </AppleCard>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="mt-8">
            <AppleButton
              variant="primary"
              className="px-6 py-3"
              onClick={() => onSelectCategory(selectedCategory)}
            >
              Continue with {selectedCategory}
            </AppleButton>
          </div>
        )}
      </div>
    </div>
  );
};
