import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const data = [
    { name: 'Mon', completed: 4, inProgress: 2, pending: 1 },
    { name: 'Tue', completed: 3, inProgress: 3, pending: 2 },
    { name: 'Wed', completed: 5, inProgress: 1, pending: 1 },
    { name: 'Thu', completed: 2, inProgress: 4, pending: 3 },
    { name: 'Fri', completed: 6, inProgress: 2, pending: 0 },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Weekly Task Status</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="#10B981" name="Completed" />
            <Bar dataKey="inProgress" fill="#3B82F6" name="In Progress" />
            <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}