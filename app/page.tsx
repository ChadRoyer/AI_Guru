import ChatPanel from '../components/ChatPanel';
import DiagramPanel from '../components/DiagramPanel';
import { DiagramProvider } from '../components/DiagramContext';

export default function Page() {
  return (
    <DiagramProvider>
      <div className="flex h-screen">
        <div className="w-2/5 border-r border-gray-200">
          <ChatPanel />
        </div>
        <div className="w-3/5">
          <DiagramPanel />
        </div>
      </div>
    </DiagramProvider>
  );
}

