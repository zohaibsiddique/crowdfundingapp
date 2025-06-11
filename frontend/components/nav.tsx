import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@radix-ui/react-navigation-menu";
import { Menu } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";

export default function Nav() {
  return (
    <nav>
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <NavigationMenu>
          <NavigationMenuList className="md:flex gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2">Home</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2">Features</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2">Pricing</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink className="px-4 py-2">Contact</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-blue-600">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-10">
              <a href="#" className="text-lg font-medium text-gray-700">Home</a>
              <a href="#" className="text-lg font-medium text-gray-700">Features</a>
              <a href="#" className="text-lg font-medium text-gray-700">Pricing</a>
              <a href="#" className="text-lg font-medium text-gray-700">Contact</a>
              <a href="#" className="text-white bg-blue-500 hover:bg-blue-600 ml-4">Contact</a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
