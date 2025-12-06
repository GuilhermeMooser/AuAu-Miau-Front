import * as React from "react";

import { cn } from "@/lib/utils";
import Icon from "../Icon";

type InputPasswordProps = React.ComponentProps<"input"> & {
  showPassword?: boolean;
  handlePasswordView: VoidFunction;
};

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, type, showPassword, handlePasswordView, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center h-10 w-full rounded-md border border-input bg-background px-3 text-base",
          "ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        )}
      >
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex-1 bg-transparent outline-none border-none",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground"
          )}
          ref={ref}
          {...props}
        />

        <button
          type="button"
          onClick={handlePasswordView}
          className="ml-2 text-foreground hover:text-muted-foreground transition"
        >
          {showPassword ? <Icon name="EyeOff" /> : <Icon name="Eye" />}
        </button>
      </div>
    );
  }
);
InputPassword.displayName = "InputPassword";

export { InputPassword };
