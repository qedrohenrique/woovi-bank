import { cn } from "@/lib/utils";
import Image from "next/image";

type LogoProps = {
  className?: string;
  size?: number;
};

export function Logo({ className, size = 32, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Image src="/file.png" alt="Logo" width={size} height={size} />
    </div>
  );
}