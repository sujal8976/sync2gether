import { useState } from "react";
import { LabelInput } from "./labelledInput";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "motion/react";

interface PasswordInputProps {
  name?: string;
  label?: string;
  className?: string;
}

export function PasswordInput({
  name = "password",
  label = "Password *",
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`w-full flex gap-1 justify-center items-end ${className}`}>
      <LabelInput
        label={label}
        className="w-full sm:max-w-[44%]"
        type={showPassword ? "text" : "password"}
        placeholder="StrongPassword#1234"
        name={name}
        id={name}
      />
      <Button
        variant="ghost"
        size="icon"
        type="button"
        onClick={() => setShowPassword(!showPassword)}
      >
        <span className="inline-block w-5 h-5 relative">
          <AnimatePresence mode="wait">
            <motion.span
              key={showPassword ? "eye" : "eyeOff"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {showPassword ? (
                <Eye className="w-5 h-5" />
              ) : (
                <EyeOff className="w-5 h-5" />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </Button>
    </div>
  );
}
