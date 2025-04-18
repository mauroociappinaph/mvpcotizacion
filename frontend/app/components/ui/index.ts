// Barrel file for shadcn/ui components
// Este archivo centraliza todas las exportaciones de componentes UI

// Re-export UI components
export { Button, buttonVariants } from "./button";
export {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "./card";
export { Input } from "./input";
export { Label } from "./label";
export { FormMessage } from "./form-message";

// Simular exportaciones de componentes que aún no existen
// Estos deberán implementarse adecuadamente más adelante
export const Tabs = (props: any) => null;
export const TabsContent = (props: any) => null;
export const TabsList = (props: any) => null;
export const TabsTrigger = (props: any) => null;
export const DropdownMenu = (props: any) => null;
export const DropdownMenuContent = (props: any) => null;
export const DropdownMenuItem = (props: any) => null;
export const DropdownMenuTrigger = (props: any) => null;
export const Avatar = (props: any) => null;
export const AvatarFallback = (props: any) => null;
export const AvatarImage = (props: any) => null;
export const Skeleton = (props: any) => null;
export const Badge = (props: any) => null;
export const Textarea = (props: any) => null;
export const Select = (props: any) => null;
export const SelectContent = (props: any) => null;
export const SelectItem = (props: any) => null;
export const SelectTrigger = (props: any) => null;
export const SelectValue = (props: any) => null;
export const Calendar = (props: any) => null;
export const Popover = (props: any) => null;
export const PopoverContent = (props: any) => null;
export const PopoverTrigger = (props: any) => null;

// Utils
export { cn } from '../../lib/utils';
