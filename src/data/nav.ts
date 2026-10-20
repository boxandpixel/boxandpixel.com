// Single source of truth for the nav, shared by Header (which only builds the
// off-canvas menu when there is something to put in it) and Nav.
//
// Contact sits outside this list as a button. Planned order once the other
// pages exist: Work · For designers · For site owners · About · Process.
// About leads Process, matching the home page order.
export const navLinks: { href: string; label: string }[] = [
  { href: "/about", label: "About" },
];
