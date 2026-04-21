import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: ReactNode;
  actions?: ReactNode;
}

const PageHeader = ({ title, description, badge, actions }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-white">
            {title}
          </h2>
          {badge}
        </div>
        {description && (
          <p className="text-on-surface-variant text-body-md mt-2 max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
};

export default PageHeader;
