import { jobTemplate } from "../../shared/templates/job-template";
import { newTemplate } from "../../shared/templates/new-template";
import { propertyTemplate } from "../../shared/templates/property-templates";

export const TEMPLATE_OPTIONS = [
  {
    label: 'Tuyển dụng',
    value: 'job',
    design: jobTemplate,
  },
  {
    label: 'Tin tức',
    value: 'new',
    design: newTemplate,
  },
  {
    label: 'Dự án',
    value: 'project',
    design: propertyTemplate,
  },
];