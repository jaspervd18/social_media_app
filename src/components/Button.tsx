import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  small?: boolean;
  gray?: boolean;
  className?: string;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export function Button({ small, gray, className = "", ...props }: ButtonProps) {
  const sizeClasses = small ? "px-2 py-1" : "px-4 py-2 font-bold";
  const colorClasses = gray
    ? "bg-[#ffe9c4] hover:bg-[#FFD38A] focus-visible:bg-[#ffe9c4] text-[#cf7676] border-4 border-[#e3ae91]"
    : "bg-[#FFD38A] hover:bg-[#ffc461] focus-visible:bg-[#FFD38A] text-[#CC5151] border-4 border-[#E2783E]";
  return (
    <button
      className={`rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClasses} ${colorClasses} ${className}`}
      {...props}
    ></button>
  );
}
