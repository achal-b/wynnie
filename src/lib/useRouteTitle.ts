import { usePathname } from "next/navigation";

export function useRouteTitle(defaultTitle: string = "Wynnie") {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  let title = segments[segments.length - 1] || defaultTitle.toLowerCase();
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return title;
}
