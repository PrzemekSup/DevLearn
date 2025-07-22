import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Code2, User, LogOut, Menu, X, Settings } from "lucide-react";
import { MENU_LINKS, MenuLink } from "../common/Links";
import { useApiClient } from "../contexts/ApiClientContext";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { unauthorize } = useApiClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    unauthorize();
    navigate("/");
    setIsProfileOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={MENU_LINKS.HOME.url}
            className="flex items-center space-x-2 group"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DevLearn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <MenuLinkComponent
              currentPathName={location.pathname}
              link={MENU_LINKS.HOME}
            />
            <MenuLinkComponent
              currentPathName={location.pathname}
              link={MENU_LINKS.BLOG}
            />
            {user && (
              <>
                <MenuLinkComponent
                  currentPathName={location.pathname}
                  link={MENU_LINKS.DASHBOARD}
                />
                <MenuLinkComponent
                  currentPathName={location.pathname}
                  link={MENU_LINKS.PATHS}
                />
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <Link
                      to={MENU_LINKS.PROFILE.url}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <MobileNavLink to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/blog" onClick={() => setIsMenuOpen(false)}>
              Blog
            </MobileNavLink>
            {user ? (
              <>
                <MobileNavLink
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </MobileNavLink>
                <MobileNavLink to="/paths" onClick={() => setIsMenuOpen(false)}>
                  Paths
                </MobileNavLink>
                <MobileNavLink
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </MobileNavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <MobileNavLink to="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </MobileNavLink>
                <MobileNavLink
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </MobileNavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  icon: Icon,
  isActive,
  children,
}) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`}
  >
    <Icon className="h-4 w-4" />
    <span>{children}</span>
  </Link>
);

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({
  to,
  onClick,
  children,
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
  >
    {children}
  </Link>
);

export default Navbar;

type MenuLinkComponentProps = {
  currentPathName: string;
  link: MenuLink;
};

const MenuLinkComponent: React.FC<MenuLinkComponentProps> = ({
  currentPathName,
  link,
}) => {
  const isActive = currentPathName === link.url;
  return (
    <NavLink to={link.url} icon={link.icon} isActive={isActive}>
      {link.name}
    </NavLink>
  );
};
