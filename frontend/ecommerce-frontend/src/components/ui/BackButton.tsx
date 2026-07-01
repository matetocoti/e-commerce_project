import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

type BackButtonSize = "small" | "medium" | "large";
type BackButtonVariant = "ghost" | "solid" | "outline";
type BackButtonColor = "primary" | "secondary" | "tertiary";

interface BackButtonProps {
  text?: string;
  readonly size?: BackButtonSize;
  readonly variant?: BackButtonVariant;
  readonly color?: BackButtonColor;
  readonly bgColor?: BackButtonColor;
}

const variantClasses: Record<BackButtonVariant, string> = {
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 border-transparent",
  solid: "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:bg-blue-800 border-transparent",
  outline: "border border-gray-300 bg-white text-gray-800 shadow-sm hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",
};

const sizeClasses: Record<BackButtonSize, string> = {
  small: "text-sm py-1.5 px-3",
  medium: "text-base py-2 px-4",
  large: "text-lg py-2.5 px-5",
};

export function BackButton({ text, size = "medium", variant = "solid" }: Readonly<BackButtonProps>) {
  const navigate = useNavigate();
  const customClasses = `mb-6 flex items-center justify-center w-fit transition-colors ${variantClasses[variant]} ${sizeClasses[size]}`;
  return (
    <Button 
      className={customClasses} 
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className={`h-7 w-7 ${text ? "mr-2" : ""}`} />
      {text && <span>{text}</span>}
    </Button>
  );
}