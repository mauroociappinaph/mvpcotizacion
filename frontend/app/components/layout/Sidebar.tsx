'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListTodo, MessageSquare, FolderOpen, Users, Settings, FileText } from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Tasks', href: '/tasks', icon: ListTodo },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Quotations', href: '/quotations', icon: FileText },
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-16 flex-col bg-gray-900 lg:w-64">
      <div className="flex h-16 items-center justify-center lg:justify-start lg:px-4">
        <span className="text-xl font-bold text-white hidden lg:block">Turma</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul className="flex flex-1 flex-col gap-y-4 px-2 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center justify-center lg:justify-start rounded-md p-2 text-sm lg:px-3',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  )}
                >
                  <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span className="hidden lg:ml-3 lg:block">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
