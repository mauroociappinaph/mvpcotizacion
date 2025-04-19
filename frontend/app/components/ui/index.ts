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
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup
} from "./dropdown-menu";
export { Avatar, AvatarFallback, AvatarImage } from "./avatar";
export { Skeleton } from "./skeleton";
export { Badge, badgeVariants } from "./badge";
export { Textarea } from "./textarea";
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup
} from "./select";
export { Popover, PopoverContent, PopoverTrigger } from "./popover";
export { Alert, AlertDescription } from "./alert";
export { Separator } from "./separator";

// Utils
export { cn } from '../../lib/utils';
