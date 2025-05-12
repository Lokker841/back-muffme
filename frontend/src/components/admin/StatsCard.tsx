interface StatsCardProps {
  title: string
  value: string
  bgColor: string
}

export function StatsCard({ title, value, bgColor }: StatsCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-4 text-white`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
} 