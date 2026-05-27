'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { MessageCircle, X, Send, Sparkles, ChevronDown, Bot } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onMessagesChange: (msgs: ChatMessage[]) => void;
  context: Record<string, string | undefined>;
  currentStep: string;
}

const EXAMPLE_PROMPTS: Record<string, string[]> = {
  inputs: [
    "What information is most important for getting accurate strategies?",
    "I'm a B2B SaaS startup with $2K/month budget — what should I focus on?",
    "How do I figure out my target audience?",
    "What's a realistic marketing budget for an early-stage startup?",
  ],
  strategies: [
    "Explain the difference between paid ads and organic marketing",
    "Which strategy works best with a limited budget?",
    "How long does it realistically take to see marketing results?",
    "What's the biggest mistake founders make with marketing?",
  ],
  followup: [
    "How do I define my brand voice?",
    "What makes a good call-to-action?",
    "How do I measure if my marketing is working?",
    "What content should I create first?",
  ],
  plan: [
    "How do I stay consistent with my content schedule?",
    "What are the most important KPIs to track?",
    "How do I know if my messaging is resonating?",
    "What's the best way to allocate a limited marketing budget?",
  ],
  board: [
    "I'm overwhelmed by all the tasks — where do I start?",
    "How do I prioritize when I only have 5 hours/week?",
    "What are quick wins I can get in the first 2 weeks?",
    "How do I stay motivated when results are slow?",
  ],
};

const MARKETING_TIPS = [
  "💡 Focus on one channel deeply before expanding to others",
  "📊 Data without action is just numbers — always ask 'so what?'",
  "🎯 The riches are in the niches — the more specific, the better",
  "⏰ Marketing is a long game. Most strategies take 90 days minimum",
  "🔄 Test → Measure → Learn → Repeat. That's the whole playbook.",
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 0' }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>M</div>
      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '12px 16px' }}>
        <div className="loading-dots"><span /><span /><span /></div>
      </div>
    </div>
  );
}

function ChatMessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: 8, marginBottom: 16, animation: 'slideIn 0.2s ease' }}>
      {!isUser && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 12, fontWeight: 800, fontFamily: 'Bricolage Grotesque', color: 'white' }}>M</div>
      )}
      <div
        className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}
        style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function ChatBot({ isOpen, onToggle, messages, onMessagesChange, context, currentStep }: Props) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [tipIndex, setTipIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const interval = setInterval(() => setTipIndex(i => (i + 1) % MARKETING_TIPS.length), 4000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;
    setShowExamples(false);
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: content.trim(), timestamp: new Date() };
    const newMessages = [...messages, userMsg];
    onMessagesChange(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          context,
        }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply || 'Sorry, I had trouble responding. Please try again.', timestamp: new Date() };
      onMessagesChange([...newMessages, aiMsg]);
    } catch {
      const errMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I'm having trouble connecting right now. Please check your API key in your .env.local file and try again.", timestamp: new Date() };
      onMessagesChange([...newMessages, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const prompts = EXAMPLE_PROMPTS[currentStep] || EXAMPLE_PROMPTS.inputs;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 500,
          width: 56, height: 56, borderRadius: '50%',
          background: isOpen ? 'var(--surface-2)' : 'linear-gradient(135deg, var(--accent), var(--accent-2))',
          border: isOpen ? '1px solid var(--border)' : 'none',
          color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(108,99,255,0.4)',
          transition: 'all 0.3s', transform: isOpen ? 'rotate(0deg)' : 'scale(1)',
        }}
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        {!isOpen && messages.length === 0 && (
          <div style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#43e97b', border: '2px solid var(--bg)' }} />
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 500,
          width: 380, height: 560, display: 'flex', flexDirection: 'column',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.25s ease',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(255,101,132,0.05))',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bricolage Grotesque', fontWeight: 800, fontSize: 15, color: 'white' }}>M</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 15 }}>Marcus</p>
              <p style={{ fontSize: 11, color: '#43e97b', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#43e97b', display: 'inline-block' }} />
                AI Marketing Expert · Online
              </p>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', background: 'var(--surface-2)', padding: '4px 8px', borderRadius: 6 }}>
              Context: {context.companyName || 'Loading...'}
            </div>
          </div>

          {/* Scrolling tip bar */}
          <div style={{ padding: '8px 16px', background: 'rgba(108,99,255,0.06)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
            <p style={{ fontSize: 11, color: 'var(--text-3)', transition: 'opacity 0.3s', animation: 'slideIn 0.4s ease' }} key={tipIndex}>{MARKETING_TIPS[tipIndex]}</p>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👋</div>
                <p style={{ fontFamily: 'Bricolage Grotesque', fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Hey! I'm Marcus</p>
                <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 16 }}>
                  Your personal AI marketing strategist. Ask me anything about marketing, your strategy, or how to execute your plan.
                </p>
                {context.companyName && (
                  <div style={{ background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16 }}>
                    <p style={{ fontSize: 12, color: 'var(--accent)' }}>I have context about <strong>{context.companyName}</strong> — my answers will be tailored to your situation.</p>
                  </div>
                )}
              </div>
            )}

            {messages.map(msg => <ChatMessageBubble key={msg.id} message={msg} />)}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Example prompts */}
          {showExamples && messages.length === 0 && (
            <div style={{ padding: '0 16px 12px' }}>
              <p style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Try asking:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {prompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    style={{
                      padding: '8px 12px', background: 'var(--surface-2)', border: '1px solid var(--border)',
                      borderRadius: 8, color: 'var(--text-2)', fontSize: 12, textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.15s', lineHeight: 1.4,
                    }}
                    onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--accent)'; (e.target as HTMLButtonElement).style.color = 'var(--text)'; }}
                    onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--border)'; (e.target as HTMLButtonElement).style.color = 'var(--text-2)'; }}
                  >
                    <Sparkles size={10} style={{ marginRight: 6, opacity: 0.6, display: 'inline' }} />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <textarea
              ref={inputRef}
              className="input-field"
              placeholder="Ask Marcus anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ flex: 1, resize: 'none', maxHeight: 80, padding: '10px 14px', fontSize: 13, lineHeight: 1.5 }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              style={{
                width: 38, height: 38, borderRadius: 10, background: 'var(--accent)', border: 'none', color: 'white',
                cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: input.trim() && !isTyping ? 1 : 0.4, transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
