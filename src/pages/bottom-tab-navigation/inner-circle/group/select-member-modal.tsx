import { Dialog } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Search, User, CheckSquare, Square } from "lucide-react";

const SelectMembersModal = ({
  isOpen,
  onClose,
  selected = [],
  onChange,
  members = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  selected?: string[];
  onChange: (ids: string[]) => void;
  members?: any[];
}) => {
  const [search, setSearch] = useState("");
  console.log("selected:", selected);
  console.log("Members:", members);

  const toggleSelection = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((i) => i !== id)
        : [...selected, id]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === members.length) {
      onChange([]);
    } else {
      onChange(members.map((m) => m.buddyId));
    }
  };

  const filteredMembers = members.filter((m) =>
    m.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Fragment>
      <Dialog
        open={isOpen}
        onClose={onClose}
        as="div"
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 w-[90%] max-w-md space-y-4">
            <h2 className="text-lg font-bold">Select Members</h2>

            {/* Search Field */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search buddies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-md bg-gray-100"
              />
            </div>
            <h2 className="text-lg font-bold">
              Select Members
              <span className="ml-2 text-sm font-medium text-gray-500">
                ({selected.length} selected)
              </span>
            </h2>

            {/* Select All Button */}
            <div className="text-right">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 font-medium underline"
              >
                {selected.length === members.length
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            {/* List of Members */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredMembers.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{contact.fullName}</p>
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleSelection(contact.buddyId)}>
                    {selected.includes(contact.buddyId) ? (
                      <CheckSquare className="text-blue-600 w-5 h-5" />
                    ) : (
                      <Square className="text-gray-400 w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <button onClick={onClose} className="text-black border-b">
                Cancel
              </button>
              <button onClick={onClose} className="text-black border-b">
                Done
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Fragment>
  );
};

export default SelectMembersModal;
