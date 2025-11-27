import React, { useState } from 'react';
import { Participant, SubTopic } from '@/types';

interface SettingsPanelProps {
  participants: Participant[];
  topic: string;
  rounds: number;
  subTopics: SubTopic[];
  isRunning: boolean;
  onAddCharacter: () => void;
  onRemoveCharacter: (id: string) => void;
  onUpdateCharacter: (character: Participant) => void;
  onTopicChange: (topic: string) => void;
  onRoundsChange: (rounds: number) => void;
  onSubTopicsChange: (subTopics: SubTopic[]) => void;
  onStart: () => void;
}

export default function SettingsPanel({
  participants,
  topic,
  rounds,
  subTopics,
  isRunning,
  onAddCharacter,
  onRemoveCharacter,
  onUpdateCharacter,
  onTopicChange,
  onRoundsChange,
  onSubTopicsChange,
  onStart,
}: SettingsPanelProps) {
  // 子議題輸入暫存
  const [newSubTopic, setNewSubTopic] = useState('');

  const handleAddSubTopic = () => {
    if (newSubTopic.trim()) {
      onSubTopicsChange([
        ...subTopics,
        { id: Date.now().toString(), content: newSubTopic.trim() },
      ]);
      setNewSubTopic('');
    }
  };

  const handleRemoveSubTopic = (id: string) => {
    onSubTopicsChange(subTopics.filter((st) => st.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800">
      {/* 標題 */}
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          ⚙️ 會議設定
        </h2>
        <p className="text-xs text-slate-500 mt-1">設定參與角色與討論主題</p>
      </div>

      {/* 捲動區域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* 1. 主題設定 */}
        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">討論主題</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="例如：我們要不要全家去冰島旅遊？"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
            disabled={isRunning}
          />
        </section>

        {/* 2. 參與者名單 (精簡顯示) */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">參與者名單</label>
            <button
              onClick={onAddCharacter}
              disabled={isRunning}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
            >
              + 新增
            </button>
          </div>
          
          <div className="space-y-3">
            {participants.map((p) => (
              <div key={p.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white transition-colors relative group">
                {/* 刪除按鈕 (Hover 顯示) */}
                <button
                  onClick={() => onRemoveCharacter(p.id)}
                  disabled={isRunning}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="移除此角色"
                >
                  ✕
                </button>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase">姓名</label>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => onUpdateCharacter({ ...p, name: e.target.value })}
                      className="w-full text-sm bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none pb-1"
                      disabled={isRunning}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase">角色/稱謂</label>
                    <input
                      type="text"
                      value={p.role}
                      onChange={(e) => onUpdateCharacter({ ...p, role: e.target.value })}
                      className="w-full text-sm bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none pb-1"
                      disabled={isRunning}
                    />
                  </div>
                </div>

                {/* 標籤輸入 (簡化版) */}
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase">特徵標籤 (逗號分隔)</label>
                  <input
                    type="text"
                    value={p.tags.join(', ')}
                    onChange={(e) => onUpdateCharacter({ ...p, tags: e.target.value.split(',').map(t => t.trim()) })}
                    placeholder="例如：65歲, 保守"
                    className="w-full text-xs bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none pb-1 text-slate-600"
                    disabled={isRunning}
                  />
                </div>
                
                {/* 隱藏了 System Prompt 欄位 */}
              </div>
            ))}
          </div>
        </section>

        {/* 3. 子議題 (選填) */}
        <section>
          <label className="block text-sm font-semibold text-slate-700 mb-2">討論子議題 (選填)</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSubTopic}
              onChange={(e) => setNewSubTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubTopic()}
              placeholder="新增子議題..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500"
              disabled={isRunning}
            />
            <button
              onClick={handleAddSubTopic}
              disabled={isRunning}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm font-bold"
            >
              +
            </button>
          </div>
          
          <ul className="space-y-1">
            {subTopics.map((st) => (
              <li key={st.id} className="flex justify-between items-center text-sm bg-slate-50 px-3 py-2 rounded border border-slate-100">
                <span className="truncate">{st.content}</span>
                <button
                  onClick={() => handleRemoveSubTopic(st.id)}
                  disabled={isRunning}
                  className="text-slate-400 hover:text-red-500 ml-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. 輪數設定 */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">討論輪數</label>
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{rounds} 輪</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={rounds}
            onChange={(e) => onRoundsChange(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={isRunning}
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>短討論 (1)</span>
            <span>長篇大論 (10)</span>
          </div>
        </section>

      </div>

      {/* 底部按鈕區 */}
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
        <button
          onClick={onStart}
          disabled={isRunning || !topic.trim() || participants.length === 0}
          className={`
            w-full py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95
            ${isRunning 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
            }
          `}
        >
          {isRunning ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              模擬進行中...
            </span>
          ) : (
            '🚀 開始家庭會議'
          )}
        </button>
      </div>
    </div>
  );
}