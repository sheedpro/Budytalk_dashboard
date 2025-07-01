import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const CardComponentWrapper = <P extends object>(
  title: string, 
  description: string
) => (
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Component {...props} />
      </CardContent>
    </Card>
  );

  // Set display name for better debugging
  WrappedComponent.displayName = `CardComponentWrapper(${
    Component.displayName || Component.name || 'Component'
  })`;

  return WrappedComponent;
};

export default CardComponentWrapper;