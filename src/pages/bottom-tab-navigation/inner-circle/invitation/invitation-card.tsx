import React from "react";

import { isValid, parseISO, format } from "date-fns";
import { Check, X } from "lucide-react";

interface InvitationCardProps {
  senderName?: string;
  senderAvatar?: string;
  invitedAt?: string; // ISO string
  addedAt?: string; // ISO string
  libraryName?: string;
  onAccept?: () => void;
  onReject?: () => void;
  buddiesData?: any;
}

const InvitationCard: React.FC<InvitationCardProps> = ({
  senderName,
  senderAvatar,
  invitedAt,

  libraryName,
  onAccept,
  onReject,
}) => {
  const parsedDate = invitedAt ? parseISO(invitedAt) : null;

  const formattedDate =
    parsedDate && isValid(parsedDate)
      ? format(parsedDate, "dd MMM yyyy")
      : "Invalid date";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-300 rounded-md p-4 w-full max-w-3xl bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        <img
          src={senderAvatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="text-base font-semibold">{senderName}</p>
          <p className="text-xs text-gray-500">Invited On: {formattedDate}</p>
          <p className="text-sm mt-2">{libraryName}</p>
        </div>
      </div>
      <div className="flex space-x-3 mt-3 sm:mt-0">
        <button
          onClick={onAccept}
          className="p-2 border border-green-500 rounded-full text-green-600 hover:bg-green-50 transition"
        >
          <Check size={20} />
        </button>
        <button
          onClick={onReject}
          className="p-2 border border-red-500 rounded-full text-red-600 hover:bg-red-50 transition"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default InvitationCard;
