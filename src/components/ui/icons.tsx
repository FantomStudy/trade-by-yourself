import type { LucideProps } from "lucide-react";

import { Camera, Heart, Image, MessageSquare, Star, X } from "lucide-react";

import { cn } from "@/lib/utils";

export const HeartIcon = ({ className, ...props }: LucideProps) => (
  <Heart className={cn("size-6", className)} {...props} />
);

export const MessageSquareIcon = ({ className, ...props }: LucideProps) => (
  <MessageSquare className={cn("size-6", className)} {...props} />
);

export const CameraIcon = ({ className, ...props }: LucideProps) => (
  <Camera className={cn("size-6", className)} {...props} />
);

export const StarIcon = ({ className, ...props }: LucideProps) => (
  <Star className={cn("size-4", className)} {...props} />
);

export const XIcon = ({ className, ...props }: LucideProps) => (
  <X className={cn("size-4", className)} {...props} />
);

export const ImageIcon = ({ className, ...props }: LucideProps) => (
  <Image className={cn("size-6", className)} {...props} />
);
