const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center">
      <div className="p-4 rounded-full bg-teal-50 text-teal-600 mr-4">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <p className={`text-xs mt-1 font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{trend.value}% from last month
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
