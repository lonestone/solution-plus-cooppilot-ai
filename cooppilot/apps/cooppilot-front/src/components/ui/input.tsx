import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startElement, endElement, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-200",
          className
        )}
      >
        {startElement && (
          <div className="flex items-center mr-2">{startElement}</div>
        )}
        <input
          className={cn(
            "flex-1 w-full rounded-lg border-0 bg-transparent outline-none focus:ring-0",
            className,
            props.disabled && "text-muted-foreground",
            startElement && "pl-1",
            endElement && "pr-1"
          )}
          type={type}
          ref={ref}
          {...props}
        />
        {endElement && (
          <div className="flex items-center ml-2">{endElement}</div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
