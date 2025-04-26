
import React from 'react';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeatureSelector from './FeatureSelector';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* On desktop, show sidebar directly */}
        {!isMobile && (
          <aside className="w-72 bg-white border-r border-gray-200 hidden md:block overflow-y-auto">
            <FeatureSelector />
          </aside>
        )}
        
        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden p-4">
          {/* On mobile, show hamburger menu for sidebar */}
          {isMobile && (
            <div className="mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <FeatureSelector />
                </SheetContent>
              </Sheet>
            </div>
          )}
          
          {/* Page content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
