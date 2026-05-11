import { Image as ImageIcon } from "lucide-react";

interface PlaceHolderImgProps {
  readonly className?: string;
  readonly text?: string;
}

export function PlaceHolderImg({ className = "", text = "Sem Imagem" }: PlaceHolderImgProps) {
  return (
    <div 
      className={`relative flex flex-col items-center justify-center w-full h-full min-h-[120px] bg-gradient-to-br from-blue-700 to-blue-900 text-blue-100 overflow-hidden ${className}`}
    >
      {/* Efeito de brilho de vidro */}
      <div className="absolute inset-0 bg-white/5 mix-blend-overlay" />
      
      {/* Padrão suave de fundo */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "16px 16px"
        }}
      />
      
      {/* Conteúdo Central */}
      <ImageIcon className="relative z-10 w-10 h-10 mb-2 opacity-60 drop-shadow-md transition-transform duration-300 hover:scale-105" strokeWidth={1.5} />
      
      {text && (
        <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest opacity-60">
          {text}
        </span>
      )}
    </div>
  );
}
