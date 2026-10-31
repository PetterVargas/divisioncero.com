'use client';
import { SidebarTabsDropdown } from 'fumadocs-ui/components/sidebar/tabs/dropdown';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';

export function SubSectionPicker({
  tabs,
  placeholder = 'Seleccionar categoría',
}: {
  tabs: LayoutTab[];
  placeholder?: string;
}) {
  return (
    <SidebarTabsDropdown
      options={tabs}
      placeholder={placeholder}
    />
  );
}
