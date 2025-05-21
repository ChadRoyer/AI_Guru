import ChatPanel from '../components/ChatPanel';
import DiagramPanel from '../components/DiagramPanel';

export default function Page() {
  return (
    <div className="flex min-h-screen">
      <div className="w-2/5 border-r">
        <ChatPanel />
      </div>
      <div className="w-3/5">
        <DiagramPanel />
      </div>
    </div>
  );
}
