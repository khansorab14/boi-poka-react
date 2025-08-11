const GroupCard = ({
  name,
  avatar,
  membersCount,
}: {
  name: string;
  avatar: string | null;
  membersCount: number;
  isPrivate?: any;
}) => (
  <div className="flex justify-between items-center w-full px-4 py-4 bg-white rounded-xl shadow-sm border">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden text-white font-bold text-lg">
        {avatar ? (
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="bg-black w-full h-full flex items-center justify-center rounded-full">
            <span className="text-white text-lg">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <span className="text-black text-base font-medium">{name}</span>
    </div>
    <div className="flex flex-col items-center">
      <span className="text-black text-xl font-semibold">
        {membersCount.toString().padStart(2, "0")}
      </span>
      <span className="text-sm text-gray-500">members</span>
    </div>
  </div>
);
export default GroupCard;
