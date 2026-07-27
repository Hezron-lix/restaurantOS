'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Loader2, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth, useRestaurant } from "@/components/providers/staff-providers";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChatBox() {
  const { profile } = useAuth();
  const { restaurant } = useRestaurant();
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasSubmittedRef = useRef(false);

  const userName = profile?.full_name ? String(profile.full_name).split(' ')[0] : 'there';
  const restaurantName = restaurant?.name || 'the restaurant';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, statusText, errorText]);


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        submitPrompt(input.trim());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      submitPrompt(input.trim());
    }
  };

  const LOADING_MESSAGES = [
    "Checking live restaurant data...",
    "Gathering operational metrics...",
    "Reviewing today's activity..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading && !statusText.startsWith('Fetching')) {
      interval = setInterval(() => {
        setStatusText(prev => {
          if (prev.startsWith('Fetching')) return prev; // Don't override tool text
          const nextIndex = (LOADING_MESSAGES.indexOf(prev) + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading, statusText]);

  const submitPrompt = async (userMsg: string) => {
    if (!userMsg || isLoading) return;

    setInput('');
    setErrorText('');
    const newMessages = [...messages, { role: 'user', content: userMsg } as Message];
    setMessages(newMessages);
    setIsLoading(true);
    setStatusText(LOADING_MESSAGES[0]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages })
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response');
      }

      if (!res.body) throw new Error('No body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = '';

      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (!dataStr) continue;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.status === 'fetching_data') {
                setStatusText(`Fetching data from ${data.tool}...`);
              } else if (data.text) {
                setStatusText(''); // clear status
                assistantMsg += data.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1].content = assistantMsg;
                  return updated;
                });
              } else if (data.error) {
                setErrorText(data.error);
                setStatusText('');
              }
            } catch (e) {
              console.error('Failed to parse SSE line', line, e);
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
      setErrorText('An unexpected network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
      setStatusText('');
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      // Clear it from the URL so refresh doesn't resubmit
      router.replace(pathname, { scroll: false });
      submitPrompt(initialQuery);
    }
  }, [searchParams, router, pathname]);

  return (
    <div className="flex flex-col h-full bg-background border rounded-xl overflow-hidden shadow-sm">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-3 text-foreground">Hello, {userName} 👋</h3>
              <p className="text-muted-foreground text-lg mb-2">
                Welcome back to {restaurantName}.
              </p>
              <p className="text-sm text-brand/80 font-medium">
                Powered by your restaurant&apos;s live operational data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                { icon: '📊', text: 'How is the restaurant doing?' },
                { icon: '🍽️', text: 'Which tables are occupied?' },
                { icon: '👨‍🍳', text: 'How busy is the kitchen?' },
                { icon: '💰', text: "What are today's sales?" }
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => submitPrompt(suggestion.text)}
                  disabled={isLoading}
                  className="flex items-center space-x-3 p-4 bg-muted/30 hover:bg-muted/80 border border-transparent hover:border-border rounded-xl transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">{suggestion.icon}</span>
                  <span className="text-sm font-medium text-foreground">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground'}`}>
                {m.content ? (
                  m.role === 'assistant' ? (
                    <div className="space-y-3">
                      <ReactMarkdown
                        components={{
                          p: ({node, ...props}) => <p className="last:mb-0 leading-relaxed" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                          em: ({node, ...props}) => <em className="italic" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-semibold mb-2" {...props} />,
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    m.content.split('\n').map((line, j) => (
                      <p key={j} className="mb-1 last:mb-0 min-h-[1.2em]">{line}</p>
                    ))
                  )
                ) : <span className="opacity-50">...</span>}
              </div>
            </div>
          ))
        )}
        
        {errorText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-destructive/10 text-destructive flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorText}</span>
            </div>
          </div>
        )}

        {statusText && (
          <div className="flex items-center space-x-2 text-muted-foreground text-sm ml-2">
            <Loader2 className="w-4 h-4 animate-spin text-brand" />
            <span className="animate-pulse">{statusText}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Restaurant Copilot..."
            className="flex-1 rounded-full border border-input bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full w-12 h-12 flex items-center justify-center bg-brand text-white hover:bg-brand/90 disabled:bg-muted disabled:text-muted-foreground transition-colors"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
          </button>
        </form>
      </div>
    </div>
  );
}
