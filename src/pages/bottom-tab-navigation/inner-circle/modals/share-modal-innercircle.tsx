// components/ui/inner-circle/contact-share-modal.tsx
import React from "react";
import { Dialog } from "@headlessui/react";

interface Contact {
  name: string;
  phone: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  selectedContacts: string[];
  onToggleContact: (phone: string) => void;
  onSelectAll: () => void;
  selectAll: boolean;
  onShare: () => void;
}

const ShareModalInner: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  contacts,
  selectedContacts,
  onToggleContact,
  onSelectAll,
  selectAll,
  onShare,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white p-6 rounded-xl w-[90%] max-w-md mx-auto">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Select Contacts
          </Dialog.Title>
          <div className="mb-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={onSelectAll}
              />
              <span>Select All</span>
            </label>
          </div>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {contacts.map((c) => (
              <li key={c.phone} className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(c.phone)}
                    onChange={() => onToggleContact(c.phone)}
                  />
                  <span>{c.name}</span>
                </label>
                <span className="text-sm text-gray-400">{c.phone}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-end space-x-4 mt-6">
            <button onClick={onClose} className="text-gray-600 hover:underline">
              Cancel
            </button>
            <button
              onClick={onShare}
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareModalInner;
