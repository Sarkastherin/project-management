import type React from "react";

export const ContainerWithTitle = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full mx-auto">
      <main className="pt-12 pb-18 container mx-auto lg:max-w-7xl sm:max-w-lg ">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
};
export const ContainerToForms = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full max-w-7xl mt-8 mx-auto pb-18">{children}</div>;
};
