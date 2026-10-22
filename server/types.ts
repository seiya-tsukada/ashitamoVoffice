// サーバー側の型定義

import type { ChatMessageBase, ChatMessageType, OfficeUser } from "../shared/types";

export interface UserSessionData extends OfficeUser {
  lastActive: number;
  isRealUser?: boolean;
}

export interface ChatMessageData extends ChatMessageBase {
  type: ChatMessageType;
}
