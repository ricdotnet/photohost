import { ReactNode } from 'react';

import './DashboardSection.scss';

interface DashboardSectionPropsInterface {
  title: string;
  sectionContent: ReactNode;
}

export default function DashboardSection(props: DashboardSectionPropsInterface) {
  return (
    <div className="dashboard-section">
      <div className="dashboard-section__title">
        {props.title}
      </div>
      <div className="dashboard-section__content">
        {props.sectionContent}
      </div>
    </div>
  );
}
