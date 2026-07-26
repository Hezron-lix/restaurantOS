import { ChatBox } from '@/components/ai/ChatBox';

export const metadata = {
  title: 'Operations AI - RestaurantOS',
};

export default function AIPage() {
  return (
    <div className="h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto flex flex-col pt-4">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Copilot</h1>
        <p className="text-muted-foreground mt-1">Your AI assistant for real-time restaurant operations.</p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatBox />
      </div>
    </div>
  );
}
