import { ClipboardDocumentListIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Summary() {
  const stats = [
    { name: 'Total Tasks', value: '12', icon: ClipboardDocumentListIcon, color: 'bg-blue-500' },
    { name: 'Completed', value: '5', icon: CheckCircleIcon, color: 'bg-green-500' },
    { name: 'In Progress', value: '7', icon: ClockIcon, color: 'bg-yellow-500' },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.name}
          className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${item.color}`}>
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
          </dt>
          <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
          </dd>
        </div>
      ))}
    </div>
  );
}