/**
 * Antigravity 进程运行状态 Store
 * 全局单例，每 10 秒自动检测 Antigravity 是否在运行
 */

import { create } from 'zustand';
import { ProcessCommands } from '@/commands/ProcessCommands';
import { CacheCommands } from '@/commands/CacheCommands';
import { PlatformCommands } from '@/commands/PlatformCommands';

// 状态接口
interface LanguageServerState {
  // LanguageServerState 是否已经获取
  isLanguageServerStateInitialized: boolean;
}

// 操作接口
interface LanguageServerActions {
  // 初始化 LanguageServer 状态
  initializeLanguageServerState: () => Promise<void>;
  // 清除 LanguageServer 状态
  clearLanguageServerState: () => Promise<void>;
}

export const useLanguageServerState = create<LanguageServerState & LanguageServerActions>((set) => ({
  isLanguageServerStateInitialized: false,
  initializeLanguageServerState: async () => {
    try {
      // 仅在 Windows 平台下初始化
      const platformInfo = await PlatformCommands.getInfo();
      if (platformInfo.os !== 'windows') {
        return;
      }

      const result = await CacheCommands.initializeLanguageServerCache();
      if (result.success) {
        set({ isLanguageServerStateInitialized: true });
      } else {
        set({ isLanguageServerStateInitialized: false });
      }
    } catch (error) {
      // 忽略错误
    }
  },
  clearLanguageServerState: async () => {
    await CacheCommands.clearAllCache();
    set({ isLanguageServerStateInitialized: false });
  },
}));
