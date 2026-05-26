export default function PopupConfirmation({ isOpen, onClose, onAccept, title, message }) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-[800px] flex flex-col gap-10">
        <h2 className="text-xl font-semibold mb-4">
          {title}
        </h2>

        <h2 className="text-black text-xl">
            {message}
        </h2>

        <div className="flex gap-2">
          <button 
            onClick={onClose} 
            className="text-white w-full bg-blue-700"
          >
            No
          </button>
          <button
            onClick={onAccept}
            className="bg-red-700 text-white px-4 py-2 w-full"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}