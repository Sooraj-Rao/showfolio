import { Button } from "@/components/ui/button";
import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

type AlertType = "Disable" | "Private";

interface AlertMessageProps {
  type: AlertType;
}

const alertMessages: Record<AlertType, { title: string; message: string }> = {
  Disable: {
    title: "Account Disabled",
    message: "Your account has been disabled. Please activate it to continue",
  },
  Private: {
    title: "Resume Is Private",
    message: "Your resume is private. Make it public to share with others",
  },
};

export function AlertMessage({ type }: AlertMessageProps) {
  const { title, message } = alertMessages[type];

  return (
    <div className="flex justify-center">
      <div
        className="grid w-full max-w-xl items-start gap-4 
                   border border-red-300 bg-red-50 text-red-900 
                   dark:border-red-900 dark:bg-red-950 dark:text-red-100
                   p-2 rounded-md shadow-sm"
      >
        <div className="flex items-start gap-3">
          <AlertCircleIcon className="text-red-500 dark:text-red-300 mt-1" />
          <div>
            <h3 className="font-semibold ">{title}</h3>
            <div className=" flex items-center">
              <p className="text-sm">{message}</p>
              <Link href={"/resume/settings"}>
                <Button size="sm" variant="link" className=" text-red-500">
                  Go here
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
