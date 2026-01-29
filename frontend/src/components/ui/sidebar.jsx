"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

/* ---------------- CONTEXT ---------------- */

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

/* ---------------- PROVIDER ---------------- */

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

/* ---------------- ROOT ---------------- */

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

/* ---------------- BODY ---------------- */

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

/* ---------------- DESKTOP ---------------- */

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <motion.div
      className={cn(
        "hidden md:flex h-full px-4 py-4 md:flex-col w-[300px] shrink-0",
        "bg-black/30 backdrop-blur-xl border-r border-white/10",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "64px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/* ---------------- MOBILE ---------------- */

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();

  return (
    <div
      className="flex md:hidden h-10 px-4 py-4 justify-end bg-transparent w-full"
      {...props}
    >
      <IconMenu2
        className="text-white"
        onClick={() => setOpen(true)}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[100] flex flex-col justify-between p-10",
              "bg-black/40 backdrop-blur-xl",
              className
            )}
          >
            <div
              className="absolute right-6 top-6 text-white"
              onClick={() => setOpen(false)}
            >
              <IconX />
            </div>

            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- LINK ---------------- */

export const SidebarLink = ({ link, className, ...props }) => {
  const { open, animate } = useSidebar();

  return (
    <a
      href={link.href}
      onClick={link.onClick}
      className={cn(
        "group/sidebar flex gap-3 py-2",
        "text-white/80 hover:text-white transition",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm whitespace-pre group-hover/sidebar:translate-x-1 transition"
      >
        {link.label}
      </motion.span>
    </a>
  );
};
