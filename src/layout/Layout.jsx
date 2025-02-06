import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Users, Package, LogOut } from "lucide-react";

const Layout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar className="border-r">
          <SidebarHeader>
            <h1 className="text-2xl font-bold p-4">Admin Dashboard</h1>
          </SidebarHeader>
          <SidebarContent>
            <nav className="space-y-2 p-4">
              <Link to="/users">
                <Button
                  variant={
                    location.pathname === "/users" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  asChild
                >
                  <span>
                    <Users className="mr-2 h-4 w-4" />
                    Users
                  </span>
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant={
                    location.pathname === "/products" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  asChild
                >
                  <span>
                    <Package className="mr-2 h-4 w-4" />
                    Products
                  </span>
                </Button>
              </Link>
            </nav>
          </SidebarContent>
          <SidebarFooter>
            <Separator />
            <div className="p-4">
              <Button variant="destructive" className="w-full" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
            <h2 className="text-lg font-semibold">
              {location.pathname === "/users"
                ? "Users"
                : location.pathname === "/products"
                ? "Products"
                : "Home"}
            </h2>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
