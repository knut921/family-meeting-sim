import React, { useEffect, useRef } from 'react';
import { Message, Participant } from '@/types';

interface ResultsPanelProps {
  participants: Participant[];
  messages: Message[];
  streamContent: string;
  currentRound: number;
  totalRounds: number;
  isComplete: boolean;
  onExportCSV: () => void;
  onExportPDF: () => void;
}

export default function ResultsPanel({
  participants,
  messages,
  streamContent,
  currentRound,
  totalRounds,
  isComplete,
  onExportCSV,
  onExportPDF,
}: ResultsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 自動捲動到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamContent]);

  // --- 核心魔法：根據人設生成頭像 URL (家庭版優化) ---
  const getAvatarUrl = (name: string, participant?: Participant) => {
    // 1. 主持人維持機器人風格
    if (name === '主持人') {
      return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Host&backgroundColor=facc15`;
    }

    let seed = name;
    let style = 'notionists'; // 預設使用素描風格 (適合成人)

    if (participant) {
      seed = participant.id;
      const tagsStr = participant.tags.join(','); // 將標籤轉為字串方便判斷
      
      // --- 特殊角色外觀優化 ---
      
      // 嬰兒 (1歲)：改用可愛的 Emoji 風格
      if (tagsStr.includes('嬰兒') || tagsStr.includes('1歲')) {
        style = 'fun-emoji'; 
        seed = 'baby-' + seed; 
      } 
      // 小孩 (4歲, 6歲)：加上前綴讓種子產生變化 (雖然還是 Notionists，但會長得不一樣)
      // 您也可以試試看改用 'adventurer' 風格會更像小孩
      else if (tagsStr.includes('6歲') || tagsStr.includes('4歲')) {
        seed = 'child-' + seed;
      } 
      // 長輩 (65歲)
      else if (tagsStr.includes('65歲')) {
        seed = 'elder-' + seed;
      }
      
      // --- 性別微調 ---
      // 如果是女性，嘗試透過參數調整 (Notionists 支援 baseColor 或 flip)
      if (tagsStr.includes('女')) {
         // 這裡加個後綴參數稍微改變膚色或特徵，讓男女種子差異更大
         seed += '&baseColor=f9c9b6'; 
      }
    }

    // 回傳 DiceBear API 網址
    return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=transparent`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* 頂部標題列 */}
      <div className="p-4 border-b bg-white shadow-sm flex justify-between items-center flex-shrink-0 z-10">
        <div>
          <h2 className="text-lg font-bold text-slate-800">模擬結果</h2>
          <p className="text-sm text-slate-500">
            進度：第 <span className="text-blue-600 font-bold">{currentRound}</span> / {totalRounds} 輪
            {isComplete && <span className="ml-2 text-green-600 font-bold">(已完成)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExportCSV}
            disabled={messages.length === 0}
            className="px-3 py-1.5 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-50 disabled:opacity-50"
          >
            匯出 CSV
          </button>
          <button
            onClick={onExportPDF}
            disabled={messages.length === 0}
            className="px-3 py-1.5 text-sm bg-slate-800 text-white rounded hover:bg-slate-700 disabled:opacity-50"
          >
            匯出/列印
          </button>
        </div>
      </div>

      {/* 訊息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {messages.length === 0 && !streamContent && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>請在左側設定主題並點擊「開始座談」</p>
          </div>
        )}

        {messages.map((msg) => {
          // 找出對應的角色資料
          const participant = participants.find(p => 
            p.name === msg.participantCode || p.role === msg.participantCode
          );
          
          const isModerator = msg.participantCode === '主持人';
          
          // 生成頭像 URL
          const avatarUrl = getAvatarUrl(msg.participantCode, participant);

          return (
            <div key={msg.id} className={`flex gap-4 ${isModerator ? 'justify-center' : 'justify-start'}`}>
              
              {/* 頭像區域 */}
              <div className="flex-shrink-0 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border-2 overflow-hidden bg-white shadow-sm
                  ${isModerator ? 'border-yellow-400' : 'border-slate-200'}`}>
                  <img 
                    src={avatarUrl} 
                    alt={msg.participantCode}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* 如果不是主持人，顯示編號/名字縮寫 */}
                {!isModerator && participant && (
                   <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[50px]">
                     {participant.name}
                   </span>
                )}
              </div>

              {/* 對話氣泡 */}
              <div className={`flex flex-col max-w-[75%] ${isModerator ? 'items-center' : 'items-start'}`}>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-bold text-slate-800 text-sm">
                    {msg.participantCode}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap
                  ${isModerator 
                    ? 'bg-amber-50 text-slate-800 border border-amber-200 text-center' 
                    : 'bg-white text-slate-700 border border-slate-100'}
                `}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* 正在生成的動畫 */}
        {streamContent && (
           <div className="flex gap-4 opacity-70">
             <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
             <div className="bg-white p-4 rounded-2xl text-sm text-gray-400 shadow-sm border border-slate-100">
               {/* 顯示正在生成的文字片段，讓使用者知道進度 */}
               {streamContent.slice(-50) || "正在發言..."}
               <span className="animate-pulse">|</span>
             </div>
           </div>
        )}

      </div>
    </div>
  );
}