import type React from "react";

export const ContainerScrolling = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full mx-auto">
      <main className="pt-12 p-4 container mx-auto lg:max-w-7xl sm:max-w-lg">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
};

