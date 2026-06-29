import {  ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

// TODO: Add preset styles for BackButton component, like size, color, etc. and add to the interface BackButtonProps

interface BackButtonProps {
  text?: string;
  className?: string;
}

export function BackButton({ text, className }: Readonly<BackButtonProps>) {
  const navigate = useNavigate();
  return (
    <Button variant="ghost" className={`mb-6 ${className || ""}`} onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {text || ""}
    </Button>
   );
}