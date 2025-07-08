import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TestCredentialsProps {
  onUse: (email: string, password: string) => void;
  onClose: () => void;
}

const TestCredentials: React.FC<TestCredentialsProps> = ({
  onUse,
  onClose,
}) => {
  const demoEmail = "a@b.com";
  const demoPassword = "a@b.com";

  const handleUseDemo = () => {
    onUse(demoEmail, demoPassword);
    onClose();
  };

  return (
    <Card className="absolute  top-4 right-4 w-64 shadow-lg">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Try it out!</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="-mt-2 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm mb-3">
          Experience the app instantly with our demo account.
        </p>
        <Button onClick={handleUseDemo} className="w-full">
          Use Demo Credentials
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestCredentials;
