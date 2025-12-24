// resources/js/components/EmptyState.jsx
import { ArrowUpRight, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyState({
  icon: Icon = FolderIcon,
  title = "No items yet",
  description = "Get started by adding your first item.",
  primaryAction,
  secondaryAction,
  learnMoreHref,
  children,
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-12" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {primaryAction &&
              (typeof primaryAction === "object" && "label" in primaryAction ? (
                <Button onClick={primaryAction.onClick}>
                  {primaryAction.label}
                </Button>
              ) : (
                primaryAction // Allow passing full <Button> element
              ))}

            {secondaryAction &&
              (typeof secondaryAction === "object" && "label" in secondaryAction ? (
                <Button variant="outline" onClick={secondaryAction.onClick}>
                  {secondaryAction.label}
                </Button>
              ) : (
                secondaryAction
              ))}
          </div>
        )}

        {children} {/* For extra custom content inside EmptyContent */}
      </EmptyContent>

      {learnMoreHref && (
        <Button variant="link" asChild className="text-muted-foreground" size="sm">
          <a href={learnMoreHref} target="_blank" rel="noopener noreferrer">
            Learn More <ArrowUpRight className="ml-1 size-3" />
          </a>
        </Button>
      )}
    </Empty>
  );
}