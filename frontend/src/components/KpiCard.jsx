export default function KpiCard({ title, value }) {
  return (
    <div className="p-4 rounded-xl shadow bg-white">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
