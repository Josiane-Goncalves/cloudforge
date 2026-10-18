export type AppView = 'home' | 'codex' | 'lab' | 'progress';

export interface NavItem {
  id: AppView;
  label: string;
  badge?: string;
  description: string;
}
