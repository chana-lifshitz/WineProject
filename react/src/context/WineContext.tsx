import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WineContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  recommendedWines: any[] | null;
  setRecommendedWines: (wines: any[] | null) => void;
}

const WineContext = createContext<WineContextType | null>(null);

export const useWineContext = () => {
  const context = useContext(WineContext);
  if (!context) throw new Error('useWineContext must be used within WineProvider');
  return context;
};

export const WineProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCategory, setSelectedCategoryState] = useState<string>('היינות שלנו');
  const [recommendedWines, setRecommendedWines] = useState<any[] | null>(null);

  const setSelectedCategory = (category: string) => {
    setRecommendedWines(null);
    setSelectedCategoryState(category);
  };

  return (
    <WineContext.Provider value={{ selectedCategory, setSelectedCategory, recommendedWines, setRecommendedWines }}>
      {children}
    </WineContext.Provider>
  );
};
