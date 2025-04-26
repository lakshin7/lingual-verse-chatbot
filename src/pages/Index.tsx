
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/ChatInterface';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { checkApiStatus, getApiUrl } from '@/utils/apiStatus';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Index = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const status = await checkApiStatus();
      setApiConnected(status);
    };

    checkConnection();
    // Check connection status every minute
    const interval = setInterval(checkConnection, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <LanguageProvider>
      <Layout>
        <div className="flex flex-col h-full">
          {apiConnected === true && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Backend API is not connected. Make sure your Flask server is running at {getApiUrl()}.
              </AlertDescription>
            </Alert>
          )}
          
          {apiConnected === false && (
            <div className="mb-4 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>Backend connected</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Connected to: {getApiUrl()}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          <Card className="flex-1 overflow-hidden">
            <CardContent className="p-4 h-full">
              <ChatInterface />
            </CardContent>
          </Card>
        </div>
      </Layout>
    </LanguageProvider>
  );
};

export default Index;
