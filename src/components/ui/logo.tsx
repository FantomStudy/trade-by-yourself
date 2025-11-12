import Image from "next/image";

interface LogoProps {
  hiddenText?: boolean;
}

export const Logo = ({ hiddenText = false }: LogoProps) => {
  return (
    <div className="flex items-center gap-2">
      <Image alt="Logo" height={49} src="/logo.png" width={68} priority />
      {!hiddenText && <span className="text-2xl font-semibold">ТоргуйСам</span>}
    </div>
  );
};
