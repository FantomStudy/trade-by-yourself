import Image from "next/image";

export const HeroBanner = () => {
  return (
    <div className="flex h-50 justify-center bg-[#cbd8e4]">
      <Image
        alt="Hero Section"
        className="h-full object-contain"
        height={300}
        src="/hero-section.png"
        width={1440}
        priority
      />
    </div>
  );
};
