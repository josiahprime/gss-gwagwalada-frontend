"use client";
import React, { useEffect, useState, useRef } from "react";
// import { FaUserShield, FaUserTie, FaBan} from "react-icons/fa";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { Users, UserCircle, ShieldCheck, UserCog, UserX } from "lucide-react";
import { FiMoreVertical } from "react-icons/fi";
import { HiUserRemove } from "react-icons/hi";
import { AnimatePresence } from "framer-motion";
import ReactPaginate from "react-paginate";
import DropdownPortal from "app/components/DropdownPortal/DropdownPortal";
import ConfirmPortal from "app/components/ConfirmPortal/ConfirmPortal";
import { useUserStore } from "store/users/useUsersStore";
import { useThemeStore } from "store/theme/themeStore";

const UsersPage = () => {
  const theme = useThemeStore((s) => s.theme);
  const users = useUserStore((state) => state.users);
  const isLoading = useUserStore((state) => state.isLoading);
  const fetchCurrentUser = useUserStore((state) => state.fetchCurrentUser);
  const currentUser = useUserStore((state) => state.currentUser);
  const fetchUsers = useUserStore((state) => state.fetchUsers);
  const banSelectedUser = useUserStore((state) => state.banUser);
  const updateUserRole = useUserStore((state) => state.updateUserRole);

  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const usersPerPage = 10;
  const [confirmProps, setConfirmProps] = useState<{
    visible: boolean;
    title: string;
    onConfirm: () => void;
  }>({ visible: false, title: "", onConfirm: () => {} });

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, [fetchUsers, fetchCurrentUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const toggleRole = (role: string) =>
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );

  const filtered = users.filter((u) =>
    selectedRoles.length ? selectedRoles.includes(u.role) : true
  );

  const pageCount = Math.ceil(filtered.length / usersPerPage);
  const currentUsers = filtered.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  const handlePageClick = ({ selected }: { selected: number }) =>
    setCurrentPage(selected);

  const handleAction = (userId: string, action: "admin" | "moderator" | "ban" | "demote") => {
    const titles: Record<string, string> = {
      admin: "Promote to Admin?",
      moderator: "Promote to Moderator?",
      ban: "Ban this user?",
      demote: "Demote to Customer?",
    };
    const handler = () => {
      if (action === "admin") updateUserRole(userId, "admin");
      if (action === "moderator") updateUserRole(userId, "moderator");
      if (action === "ban") banSelectedUser(userId);
      if (action === "demote") updateUserRole(userId, "customer");
      setConfirmProps({ visible: false, title: "", onConfirm: () => {} });
    };
    setConfirmProps({ visible: true, title: titles[action], onConfirm: handler });
    setMenuOpen(null);
  };

  // Helper for Status Badge Styling to match OrdersTable
  const getStatusStyles = (status: string) => {
    const active = theme === "dark" ? "bg-green-900 text-green-400" : "bg-green-100 text-green-700";
    const inactive = theme === "dark" ? "bg-yellow-900 text-yellow-400" : "bg-yellow-100 text-yellow-700";
    const banned = theme === "dark" ? "bg-red-900 text-red-400" : "bg-red-100 text-red-700";
    
    if (status === "active") return active;
    if (status === "inactive") return inactive;
    return banned;
  };

  return (
    <div
      className={`shadow-md p-5 m-5 rounded-lg transition-colors duration-500
        ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-500"}`}
    >

      {/* Header */}
      <div  className="px-6">
        <DashboardHeader
          title="Team Members"
          description="View, add, or manage users in the system."
          badgeText="User Management"
          BadgeIcon={Users}
          infoLabel="View users"
          InfoIcon={UserCircle}
        />
      </div>


      <div className={`p-6 m-4 rounded-xl shadow-xl transition-colors duration-500 ${
        theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-700"
      }`}>
        
        

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["admin", "manager", "customer"].map((role) => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-sm ${
                selectedRoles.includes(role)
                  ? "bg-blue-600 text-white"
                  : theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className={`${theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-700"} text-left`}>
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Joined</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className={`border-b transition-colors duration-500 ${
                    theme === "dark" ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      theme === "dark" ? "bg-gray-800 text-blue-400" : "bg-blue-50 text-blue-700"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right relative">
                    {currentUser && user.id !== currentUser.id && (
                      <>
                        <button
                          ref={(el) => { btnRefs.current[user.id] = el; }}
                          onClick={() => setMenuOpen(menuOpen === user.id ? null : user.id)}
                          className={`p-2 rounded-full transition-colors ${
                            theme === "dark" ? "hover:bg-gray-600" : "hover:bg-gray-200"
                          }`}
                        >
                          <FiMoreVertical />
                        </button>

                        <AnimatePresence>
                          {menuOpen === user.id && (
                            <DropdownPortal
                              open={menuOpen === user.id}
                              buttonRef={{ current: btnRefs.current[user.id] }}
                              onClose={() => setMenuOpen(null)}
                            >
                              <MenuItem
                                icon={<ShieldCheck className="text-green-600" size={16} />}
                                label="Promote to Admin"
                                onClick={() => handleAction(user.id, "admin")}
                              />

                              <MenuItem
                                icon={<UserCog className="text-blue-600" size={16} />}
                                label="Promote to Moderator"
                                onClick={() => handleAction(user.id, "moderator")}
                              />

                              <MenuItem
                                icon={<HiUserRemove className="text-orange-600" />}
                                label="Demote to Customer"
                                onClick={() => handleAction(user.id, "demote")}
                              />
                              <div className={`border-t ${theme === "dark" ? "border-gray-700" : "border-gray-100"}`}></div>
                              <MenuItem
                                icon={<UserX className="text-red-600" size={16} />}
                                label="Ban User"
                                onClick={() => handleAction(user.id, "ban")}
                              />
                            </DropdownPortal>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-8">
            <ReactPaginate
              previousLabel="← Prev"
              nextLabel="Next →"
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName="flex justify-center items-center gap-2"
              pageClassName={`px-3 py-1 rounded-lg border transition-all duration-300 text-xs font-medium ${
                theme === "dark" ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
              activeClassName="!bg-blue-600 !text-white !border-blue-600"
              previousClassName={`px-3 py-1 rounded-lg border text-xs font-medium ${
                theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
              }`}
              nextClassName={`px-3 py-1 rounded-lg border text-xs font-medium ${
                theme === "dark" ? "border-gray-600 text-gray-300" : "border-gray-300 text-gray-600"
              }`}
            />
          </div>
        )}

        <ConfirmPortal
          visible={confirmProps.visible}
          title={confirmProps.title}
          onConfirm={confirmProps.onConfirm}
          onClose={() => setConfirmProps({ visible: false, title: "", onConfirm: () => {} })}
        />
      </div>
    </div>
  );
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onClick, className = "" }) => {
  const theme = useThemeStore((s) => s.theme);
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-200 ${
        theme === "dark" ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-50 text-gray-700"
      } ${className}`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

export default UsersPage;