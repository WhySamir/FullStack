import { useState } from "react";
import { X } from "lucide-react";
type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
};
export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  videoId,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${import.meta.env.VITE_FRONTEND_BASE_URL}/watch/${videoId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black/40 z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h2 className="text-white text-lg font-medium text-center">
            Share in a post
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-zinc-700 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-center mb-4">
            <button className="bg-white text-black font-medium py-2 px-4 rounded-full">
              Create post
            </button>
          </div>

          <div className="border-t border-zinc-700 pt-3">
            <h3 className="text-white text-lg mb-3">Share</h3>

            <div className="flex items-center mb-4">
              <div className="bg-zinc-800 flex-grow rounded-l-md p-3 text-white text-sm overflow-hidden truncate">
                {shareUrl}
              </div>
              <button
                onClick={handleCopy}
                className={`rounded-r-md p-3 text-sm font-medium ${
                  copied ? "bg-blue-600" : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
