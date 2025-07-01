import { useState } from "react";
import { TemplateTable } from "@/components/TemplateManagementWhatsUp/TemplatesTable";
import { TemplateSearchFilter } from "@/components/TemplateManagementWhatsUp/TemplateSearchFilter";
import { TemplateCard } from "@/components/TemplateManagementWhatsUp/TemplateCard";
import { Template } from "@/types/template";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function TemplateDashboard() {
  const [templates, setTemplates] = useState<Template[]>([
    // Mock data; replace with API data
    {
      id: "1",
      name: "order_confirmation ",
      category: "UTILITY",
      status: "APPROVED",
      language: "en_US",
      lastModified: "2025-05-20T10:00:00Z",
      createdBy: "Admin",
      components: [
        { type: "HEADER", format: "TEXT", text: "farmsell Order Confirmed" },
        { type: "BODY", text: "Hi {{F_NAME}}, your order {{orderNumber}} is confirmed." },
      ],
    },
    {
      id: "2",
      name: "seasonal_promotion",
      category: "MARKETING",
      status: "PENDING",
      language: "es_ES",
      lastModified: "2025-05-21T12:00:00Z",
      createdBy: "Admin",
      components: [
        { type: "HEADER", format: "TEXT", text: "Summer Sale" },
        { type: "BODY", text: "Shop now and save {{1}}%!" },
        {
          type: "BUTTONS",
          buttons: [{ type: "QUICK_REPLY", text: "Unsubscribe" }],
        },
      ],
    },
    {
      id: "3",
      name: "verify_email",
      category: "AUTHENTICATION",
      status: "PENDING",
      language: "en_US",
      lastModified: "2025-05-20T10:00:00Z",
      createdBy: "Admin",
      components: [
        { type: "HEADER", format: "TEXT", text: "Verify your email" },
        { type: "BODY", text: "Hi {{F_NAME}}, your order {{orderNumber}} is confirmed." },
        { type: "BUTTON", text: "Verify email" },
      ],
    },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    type: "",
    language: "",
  });

  const handleSearch = (newFilters: {
    search: string;
    status: string;
    type: string;
    language: string;
  }) => {
    setFilters(newFilters);
    // Filter templates based on criteria; replace with API call in production
    const filtered = templates.filter((template) => {
      return (
        (!newFilters.search ||
          template.name.toLowerCase().includes(newFilters.search.toLowerCase())) &&
        (!newFilters.status || template.status === newFilters.status) &&
        (!newFilters.type || template.category === newFilters.type) &&
        (!newFilters.language || template.language === newFilters.language)
      );
    });
    setTemplates(filtered);
  };

  const handleEdit = (template: Template) => {
    // Implement edit logic (e.g., open a form modal)
    console.log("Edit template:", template);
  };

  const handleDelete = (templateId: string) => {
    // Implement delete logic (e.g., API call to Meta)
    setTemplates(templates.filter((t) => t.id !== templateId));
  };

  const handleResubmit = (template: Template) => {
    // Implement resubmit logic (e.g., API call to Meta)
    console.log("Resubmit template:", template);
  };

  const handleRowClick = (template: Template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Template Management Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create New Template
        </Button>
      </div>

      <TemplateSearchFilter onSearch={handleSearch} />

      <div className="mt-6">
        <TemplateTable
          templates={templates}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResubmit={handleResubmit}
          onRowClick={handleRowClick}
        />
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Template Details</DialogTitle>
          </DialogHeader>
          {selectedTemplate && <TemplateCard template={selectedTemplate} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}