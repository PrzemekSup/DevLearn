import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type ActionBadgeColor = "blue" | "purple" | "green";
const colorClasses = {
  blue: {
    container: "bg-blue-50 hover:bg-blue-100",
    text: "text-blue-600",
    icon: "text-blue-600",
  },
  purple: {
    container: "bg-purple-50 hover:bg-purple-100",
    text: "text-purple-600",
    icon: "text-purple-600",
  },
  green: {
    container: "bg-green-50 hover:bg-green-100",
    text: "text-green-600",
    icon: "text-green-600",
  },
};

type BaseActionBadgeProps = {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
};

type ActionBadgeLinkProps = BaseActionBadgeProps & {
  linkTo: string;
};

type ActionBadgeButtonProps = BaseActionBadgeProps & {
  onClick: () => void;
};

type ActionBadgeProps = ActionBadgeLinkProps | ActionBadgeButtonProps;

export const ActionBadgeBlue = (props: ActionBadgeProps) => {
  return <ActionBadge color="blue" actionBadgeProps={props} />;
};

export const ActionBadgePurple = (props: ActionBadgeProps) => {
  return <ActionBadge color="purple" actionBadgeProps={props} />;
};

export const ActionBadgeGreen = (props: ActionBadgeProps) => {
  return <ActionBadge color="green" actionBadgeProps={props} />;
};

type InternalActionBadgeProps = {
  actionBadgeProps: ActionBadgeProps;
  color: ActionBadgeColor;
};

const ActionBadge = ({ color, actionBadgeProps }: InternalActionBadgeProps) => {
  const classes = colorClasses[color];
  const { icon: Icon, children } = actionBadgeProps;

  const content = (
    <>
      <Icon className={`h-5 w-5 ${classes.icon} mr-3`} />
      <span className={`${classes.text} font-medium`}>{children}</span>
      <ArrowRight
        className={`h-4 w-4 ${classes.icon} ml-auto group-hover:translate-x-1 transition-transform`}
      />
    </>
  );

  const className = `flex items-center p-3 ${classes.container} rounded-lg transition-colors group`;

  if ("linkTo" in actionBadgeProps) {
    return (
      <Link to={actionBadgeProps.linkTo} className={className}>
        {content}
      </Link>
    );
  }

  if ("onClick" in actionBadgeProps) {
    return (
      <button onClick={actionBadgeProps.onClick} className={className}>
        {content}
      </button>
    );
  }

  return <span className={className}>{content}</span>;
};
