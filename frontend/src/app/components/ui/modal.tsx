import { X } from "lucide-react";
import { Button } from "./button";
import { ReactNode } from "react";

interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, open, onClose, title, children, size = "md" }: ModalProps) {
  const modalOpen = isOpen ?? open ?? false;
  
  if (!modalOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <div className="fixed inset-0 lg:left-64 top-[73px] z-50 flex items-center justify-center p-4">

      <div 
        className="fixed inset-0 lg:left-64 top-[73px] bg-[#200B43]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div 
        className={`relative z-[60] w-full ${sizeClasses[size]} max-h-[calc(100vh-100px)] transform overflow-hidden rounded-xl border border-[#937CB4]/20 bg-white shadow-2xl transition-all flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#937CB4]/20 bg-gradient-to-r from-[#F0E9FF]/50 to-white px-6 py-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-[#200B43]">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-[#F0E9FF]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}