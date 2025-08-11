// components/ui/shelves/share-book-flow.tsx
import React from "react";

interface Contact {
  fullName: string;
  phoneNumber: string;
}

interface ShareBooksFlowProps {
  shareModeStage: string | null;
  setShareModeStage: (stage: string | null) => void;
  fullName: string;
  setFullName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  contactList: Contact[];
  selectedContacts: string[];
  setSelectedContacts: (contacts: string[]) => void;
  handleShare: (
    invitees: { fullName: string; phoneNumber: string }[]
  ) => Promise<void>;
}

const ShareBooksFlow: React.FC<ShareBooksFlowProps> = ({
  shareModeStage,
  setShareModeStage,
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  contactList,
  selectedContacts,
  setSelectedContacts,
  handleShare,
}) => {
  if (!shareModeStage) return null;

  console.log(contactList, "contactList");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
        {shareModeStage === "select" ? (
          <>
            <h2 className="text-lg font-bold mb-4 text-center">
              Choose Sharing Mode
            </h2>
            <div className="space-y-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shareMode"
                  onChange={() => setShareModeStage("customInput")}
                />
                <span>Share with custom contact</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="shareMode"
                  onChange={() => setShareModeStage("contactList")}
                />
                <span>Share from contact list</span>
              </label>
            </div>
            <div className="flex justify-between">
              <button
                className="w-full border rounded py-2 mr-2"
                onClick={() => setShareModeStage(null)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : shareModeStage === "customInput" ? (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Share Book
            </h2>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full border rounded px-3 py-2 mb-6"
            />
            <div className="flex justify-between">
              <button
                className="w-full border rounded py-2 mr-2"
                onClick={() => setShareModeStage(null)}
              >
                Cancel
              </button>
              <button
                className="w-full bg-yellow-500 text-white rounded py-2 ml-2 disabled:opacity-50"
                disabled={!fullName || !phoneNumber}
                onClick={async () => {
                  await handleShare([{ fullName, phoneNumber }]);

                  setShareModeStage(null);
                  setFullName("");
                  setPhoneNumber("");
                }}
              >
                Share
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Select Contact
            </h2>
            <div className="space-y-2 mb-4">
              {contactList.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const alreadySelected = selectedContacts.includes(
                      contact.phoneNumber
                    );
                    setSelectedContacts(
                      alreadySelected
                        ? selectedContacts.filter(
                            (p) => p !== contact.phoneNumber
                          )
                        : [...selectedContacts, contact.phoneNumber]
                    );
                  }}
                  className={`w-full text-left p-3 rounded border 
                    ${
                      selectedContacts.includes(contact.phoneNumber)
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    }`}
                >
                  <div className="font-semibold">{contact.fullName}</div>
                  <div className="text-sm text-gray-500">
                    {contact.phoneNumber}
                  </div>
                </button>
              ))}
            </div>

            {selectedContacts.length > 0 && (
              <button
                onClick={async () => {
                  const selected = contactList.filter((c) =>
                    selectedContacts.includes(c.phoneNumber)
                  );
                  const invitees = selected.map((c) => ({
                    fullName: c.fullName,
                    phoneNumber: c.phoneNumber,
                  }));
                  await handleShare(invitees);
                  setSelectedContacts([]);
                  setShareModeStage(null);
                }}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Share with {selectedContacts.length} contact
                {selectedContacts.length > 1 ? "s" : ""}
              </button>
            )}

            <button
              className="w-full border rounded py-2 mt-2"
              onClick={() => setShareModeStage(null)}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareBooksFlow;
