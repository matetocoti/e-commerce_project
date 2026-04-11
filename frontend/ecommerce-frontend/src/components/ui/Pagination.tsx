import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "./utils";
import { Button } from "./Button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({className, ...props}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    />
  );
}

function PaginationItem(props: React.ComponentProps<"li">) {
  return <li {...props} />;
}

type PaginationButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  readonly isActive?: boolean;
  readonly size?: "default" | "sm" | "lg" | "icon";
};

function PaginationButton({className, isActive = false, size = "icon", ...props}: Readonly<PaginationButtonProps>) {
  return (
    <Button
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={className}
      {...props}
    />
  );
}

function PaginationPrevious({className, ...props}: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <PaginationButton
      aria-label="Ir para a página anterior"
      size="default"
      className={cn("gap-1 px-3", className)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:block">Anterior</span>
    </PaginationButton>
  );
}

function PaginationNext({className ,...props}: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <PaginationButton
      aria-label="Ir para a próxima página"
      size="default"
      className={cn("gap-1 px-3", className)}
      {...props}
    >
      <span className="hidden sm:block">Próxima</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationButton>
  );
}

function PaginationEllipsis({className, ...props}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn("flex h-10 w-10 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">Mais páginas</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};