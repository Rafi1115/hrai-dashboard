"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RxAvatar } from "react-icons/rx";

import {
  LayoutDashboard,
  FileText,
  Wallet,
  Users,
  Megaphone,
  CreditCard,
  HelpCircle,
  Bell,
  Settings,
  Image as ImageIcon,
  BanknoteArrowDown,
  Users2,
  UserPlus2,
  DiamondPlus,
  FileVideo,
} from "lucide-react";

import Image from "next/image";
import dreckks from "../../public/tika-food.svg"; // This import seems unused
import barss from "../../public/icon/bars.png"; // This import seems unused
import toast from "react-hot-toast";
import { getApiUrl } from "./configs/api";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    name: "User Management",
    href: "/admin/user-list",
    icon: Users,
  },

  {
    name: "Subscription  Overview",
    href: "/admin/earning",
    icon: (props) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        {...props}
      >
        <path
          d="M13.9 18.2672H11.39C9.75 18.2672 8.42 16.8872 8.42 15.1872C8.42 14.7772 8.76 14.4372 9.17 14.4372C9.58 14.4372 9.92 14.7772 9.92 15.1872C9.92 16.0572 10.58 16.7672 11.39 16.7672H13.9C14.55 16.7672 15.09 16.1872 15.09 15.4872C15.09 14.6172 14.78 14.4472 14.27 14.2672L10.24 12.8472C9.46 12.5772 8.41 11.9972 8.41 10.2072C8.41 8.66725 9.62 7.42725 11.1 7.42725H13.61C15.25 7.42725 16.58 8.80725 16.58 10.5072C16.58 10.9172 16.24 11.2572 15.83 11.2572C15.42 11.2572 15.08 10.9172 15.08 10.5072C15.08 9.63725 14.42 8.92725 13.61 8.92725H11.1C10.45 8.92725 9.91 9.50725 9.91 10.2072C9.91 11.0772 10.22 11.2472 10.73 11.4272L14.76 12.8472C15.54 13.1172 16.59 13.6972 16.59 15.4872C16.58 17.0172 15.38 18.2672 13.9 18.2672Z"
          fill="white"
        />
        <path
          d="M12.5 19.5972C12.09 19.5972 11.75 19.2572 11.75 18.8472V6.84717C11.75 6.43717 12.09 6.09717 12.5 6.09717C12.91 6.09717 13.25 6.43717 13.25 6.84717V18.8472C13.25 19.2572 12.91 19.5972 12.5 19.5972Z"
          fill="white"
        />
        <path
          d="M15.5 23.5972H9.5C4.07 23.5972 1.75 21.2772 1.75 15.8472V9.84717C1.75 4.41717 4.07 2.09717 9.5 2.09717H15.5C20.93 2.09717 23.25 4.41717 23.25 9.84717V15.8472C23.25 21.2772 20.93 23.5972 15.5 23.5972ZM9.5 3.59717C4.89 3.59717 3.25 5.23717 3.25 9.84717V15.8472C3.25 20.4572 4.89 22.0972 9.5 22.0972H15.5C20.11 22.0972 21.75 20.4572 21.75 15.8472V9.84717C21.75 5.23717 20.11 3.59717 15.5 3.59717H9.5Z"
          fill="white"
        />
      </svg>
    ),
  },

  {
    name: "Affiliate  Management",
    href: "/admin/affiliate-management",
    icon: FileVideo,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },

  { name: "Settings", href: "/admin/settings", icon: Settings },
];

const Sidebar = ({ isOpen, setIsOpen, adminInfo }) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = React.useState(null);

  useEffect(() => {
    // Check if the user is logged in
    // get access token from cookies
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];
    setAccessToken(token);
  }, []);

  console.log(accessToken)

  const handleLogout = () => {
    const payload = {
      refresh: localStorage.getItem("adminTokenRefresh"),
    };

    fetch(
      getApiUrl('/api/auth/logout/')  , 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Clear local storage and cookies
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminTokenRefresh");
          document.cookie =
            "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

          // Redirect to login page
          router.push("/");
          toast.success("Logged out successfully!");
        } else {
          toast.error("Logout failed. Please try again.");
        }
      });
  };

  const pathname = usePathname();

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full bg-white text-black shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"
        }`}
      >
        <div className="flex flex-col h-full justify-between border-r border-[#D6D6D6]">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between border-b border-[#D6D6D6]  px-4 ">
            <Image
              src="/side-bar-logo.png"
              alt="Arkive"
              width={150}
              height={150}
              className="rounded-lg"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-200 rounded text-[#013D3B]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="8"
                viewBox="0 0 21 8"
                fill="none"
              >
                <path
                  d="M1.5 1H19.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1.5 7H19.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="mt-4 space-y-6 flex-grow overflow-y-auto">
            {navItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              // Special handling for Earning Overview icon
              if (name === "Earning Overview") {
                return (
                  <Link
                    key={name}
                    href={href}
                    className={`flex items-center py-3 px-4 w-[218px] mx-auto transition-all rounded ${
                      isActive ? " bg-gradient-to-r from-[#013D3B] via-[#0A6E6E] to-[#013D3B] text-white" : "text-[#000000]"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5 mr-3"
                      style={{ minWidth: 20, minHeight: 20 }}
                      // Change SVG color based on active state
                      // We'll override fill via props
                      stroke={isActive ? "white" : "#013D3B"}
                    />
                    <span className="font-medium text-[16px]">{name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center py-3 px-4 w-[218px] mx-auto transition-all rounded ${
                    isActive ? " bg-gradient-to-r from-[#013D3B] via-[#0A6E6E] to-[#013D3B] text-white" : "text-[#000000]"
                  }`}
                >
                  <Icon
                    className="w-5 h-5 mr-3"
                    stroke={isActive ? "white" : "#013D3B"}
                  />
                  <span className="font-medium text-[16px]">{name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section at the bottom */}
          <div className="border-t border-[#D6D6D6] p-[30px] flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              {/* Placeholder image for Maietry Cruz */}
              {adminInfo?.profile_picture ? (
                <Image
                  src={adminInfo?.profile_picture} // Example placeholder
                  alt={adminInfo?.name || "Admin"}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <RxAvatar size={40} />
              )}
              {/* {
                user?.userName ? <> */}
              {/* <Image
                  src={user?.userImage || "/avterimage.jpg"} // Use user image or placeholder
                  alt="Maietry Cruz"
                  width={40}
                  height={40}
                  className="object-cover"
                  />
                </>
                : */}
              {/* <RxAvatar size={40}/> */}
              {/* } */}
            </div>
            <div>
              <p className="text-black text-sm font-medium">
                {adminInfo?.name || "N/A"}
              </p>
              <p className="text-gray-500 text-xs">
                {adminInfo?.email || "N/A"}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-[#D6D6D6] py-5 ">
            <button
              onClick={handleLogout}
              className="flex ml-9 gap-2 cursor-pointer items-center text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M12.7 18.5583H12.5916C8.89164 18.5583 7.10831 17.1 6.79997 13.8333C6.76664 13.4917 7.01664 13.1833 7.36664 13.15C7.69997 13.1166 8.01664 13.375 8.04997 13.7167C8.29164 16.3333 9.52497 17.3083 12.6 17.3083H12.7083C16.1 17.3083 17.3 16.1083 17.3 12.7167V7.28332C17.3 3.89165 16.1 2.69165 12.7083 2.69165H12.6C9.50831 2.69165 8.27497 3.68332 8.04997 6.34998C8.00831 6.69165 7.71664 6.94998 7.36664 6.91665C7.01664 6.89165 6.76664 6.58332 6.79164 6.24165C7.07497 2.92498 8.86664 1.44165 12.5916 1.44165H12.7C16.7916 1.44165 18.5416 3.19165 18.5416 7.28332V12.7167C18.5416 16.8083 16.7916 18.5583 12.7 18.5583Z"
                  fill="#FF0000"
                />
                <path
                  d="M3.01672 9.875H12.5001C12.5302 9.87502 12.5614 9.88746 12.587 9.91309C12.6127 9.93872 12.6251 9.96987 12.6251 10C12.6251 10.0301 12.6127 10.0613 12.587 10.0869C12.5614 10.1125 12.5302 10.125 12.5001 10.125H3.01672C2.98658 10.125 2.95545 10.1126 2.92981 10.0869C2.90417 10.0613 2.89172 10.0301 2.89172 10C2.89172 9.96985 2.90417 9.93873 2.92981 9.91309C2.95545 9.88744 2.98658 9.875 3.01672 9.875Z"
                  fill="#FF0000"
                  stroke="#FF0000"
                />
                <path
                  d="M4.92432 7.09521L4.96338 7.12061C4.98473 7.14212 4.99756 7.17281 4.99756 7.2085C4.99754 7.22619 4.99465 7.24262 4.98877 7.25732L4.96338 7.29639L2.61279 9.646L2.25928 10.0005L2.61279 10.354L4.96338 12.7036C4.98479 12.7251 4.99751 12.7558 4.99756 12.7915C4.99756 12.8272 4.98471 12.8579 4.96338 12.8794L4.95752 12.8862L4.95166 12.8921C4.94839 12.8956 4.94108 12.9022 4.92725 12.9077C4.91276 12.9135 4.89424 12.9164 4.87549 12.9165C4.85781 12.9165 4.84194 12.9131 4.82861 12.9077L4.78662 12.8794L1.99561 10.0884C1.97417 10.0669 1.96056 10.0361 1.96045 10.0005C1.96045 9.98253 1.96418 9.96556 1.97021 9.95068L1.99561 9.91162L4.78662 7.12061C4.80815 7.09908 4.83964 7.08545 4.87549 7.08545C4.89325 7.0855 4.90958 7.08925 4.92432 7.09521Z"
                  fill="#FF0000"
                  stroke="#FF0000"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Open Button (When Sidebar is Closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 bg-[#013D3B] p-2 rounded-md shadow-lg flex items-center justify-center hover:bg-[#025a57] transition"
        >
          <Image src={barss} alt="menu" width={24} height={24} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
