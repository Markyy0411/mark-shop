"use client";

interface ProductCardProps {
  name: string;
  desc?: string;
  price: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function ProductCard({ name, desc, price, selected, onClick }: ProductCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        bg-navy-300 border-[1.5px] rounded-[10px] p-[11px] cursor-pointer transition-all relative overflow-hidden group
        ${selected ? "border-brand bg-brand/10" : "border-navy-300 hover:border-brand/45 hover:bg-navy-200"}
      `}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-amber-400 transition-transform origin-left ${selected ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
      
      <div className="font-rajdhani font-semibold text-[0.9rem] text-tx-main leading-snug">{name}</div>
      {desc && <div className="text-[0.68rem] text-tx-muted mt-0.5 leading-relaxed">{desc}</div>}
      <div className="font-rajdhani font-bold text-[1.1rem] text-brand mt-1.5">{price}</div>

      {selected && (
        <div className="absolute top-[7px] right-[7px] w-[18px] h-[18px] rounded-full bg-brand flex items-center justify-center text-[0.65rem] font-bold">
          ✓
        </div>
      )}
    </div>
  );
}
