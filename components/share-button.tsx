import { Check, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function ShareButton({}) {
  const [showSuccess, setShowSuccess] = useState(false);
  const handleClick = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied shareable link to clipboard", {
      position: "top-center",
      duration: 4000,
    });
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-neutral-700 cursor-pointer"
      disabled={showSuccess}
      onClick={handleClick}>
      {showSuccess ? <Check /> : <SquareArrowOutUpRight />}
    </Button>
  );
}
