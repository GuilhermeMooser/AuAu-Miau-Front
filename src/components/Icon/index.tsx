import { icons, LucideProps } from "lucide-react";

type IconName = keyof typeof icons;

type IconProps = Omit<LucideProps, 'ref'> & {
  name: IconName;
};

const Icon = ({ name, color, size, ...props }: IconProps) => {
  const LucideIcon = icons[name];
  return <LucideIcon color={color} size={size} {...props} />;
};

export default Icon;