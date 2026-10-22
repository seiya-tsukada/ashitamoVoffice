# Virtual RPG & Business Workspace (ovice-style Virtual Office)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38bdf8.svg)](https://tailwindcss.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-ws-orange.svg)](https://github.com/websockets/ws)

---

[日本語](#日本語ドキュメント) | [English](#english-documentation)

---

<a id="日本語ドキュメント"></a>
## 🇯🇵 日本語ドキュメント

### 1. 概要 (Overview)
本アプリケーションは、oviceにインスパイアされた「リアルタイム空間同期」と「ビジネス用途の仮想オフィス」を融合させたバーチャルワークスペースです。
2Dマップ上でのアバター移動、近接度に応じた空間音声通話（距離減衰シミュレーション）、ゾーン判定（居場所プロパティの自動更新）、リアルタイムチャット、1on1/会議室予約機能を備えています。

---

### 2. アーキテクチャ (Architecture)

本システムは、**フルスタック構成（Client-Side SPA + Node.js / Express + WebSocket Server）** で設計されています。

```
                                  [ クライアント (Browser) ]
                                              │
                      ┌───────────────────────┴───────────────────────┐
                      │ HTTP / REST API (port 3000)                   │ WebSocket (ws:// / wss://)
                      ▼                                               ▼
         ┌──────────────────────────┐                    ┌────────────────────────┐
         │ Express HTTP Server      │                    │ WebSocket Server (ws)  │
         │ - Vite SPA 静的配信      │                    │ - 座標同期 (Position)  │
         │ - /api/session/users     │                    │ - プロフィール同期     │
         │ - /api/session/chats     │                    │ - チャット同期 (Chat)  │
         │ - /api/health            │                    │ - リアクション同期     │
         └──────────────────────────┘                    └───────────┬────────────┘
                                                                     │
                                                                     ▼
                                                         ┌────────────────────────┐
                                                         │ In-Memory Session Store│
                                                         │ (アクティブメンバー管理)│
                                                         └────────────────────────┘
```

#### ■ フロントエンド (Frontend)
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4（グラフィカルなオフィスゾーン、リッチなUI）
- **Icons**: Lucide React
- **Animations**: Motion (`motion/react`)
- **Realtime Layer**: `useRealtimeOffice` カスタムフックによる WebSocket 自動再接続・座標補間・空間音声距離計算

#### ■ バックエンド (Backend)
- **Runtime**: Node.js (ESM / CommonJS bundle via `esbuild`)
- **Server**: Express 4.x
- **WebSocket**: `ws` ライブラリ（HTTPサーバーと同一ポート `3000` で統合）

#### ■ 空間音声＆ゾーン判定ロジック (Spatial Audio & Zone Logic)
1. **ユークリッド距離のリアルタイム計算**:
   $$\text{distance} = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$
2. **減衰モデル**:
   - `distance <= voiceRange`：最大音量・接続確立
   - `voiceRange < distance <= voiceRange * 1.5`：音量リニア減衰
   - それ以上：ミュート（通話圏外）
3. **ゾーン検知**: メンバーの `(x, y)` 座標を監視し、ゾーン矩形内に入った時点で `currentZoneId` および `currentLocationName`（居場所プロパティ）を自動更新・サーバーへブロードキャスト。

---

### 3. データの持ち方 (Data Management & State)

| 領域 | 格納先 | 主な保持データ |
| :--- | :--- | :--- |
| **クライアント状態** | React State (`useState`, `useRef`) | 現在の自身のアバター座標、選択中フロア、接続中メンバー一覧、チャットメッセージ配列、モーダル開閉状態 |
| **クライアント永続化** | `sessionStorage` | タブ単位のユーザー識別情報（ユーザーID、表示名、役職、職業クラス、アバター表示モード、アバターURL） |
| **サーバーリアルタイム状態** | In-Memory (`activeUsers` Map) | 接続中の全WebSocketクライアントの位置情報、発言中フラグ、居場所プロパティ、最新アクティブ時刻 |
| **定数・マスタデータ** | `/src/constants/` | オフィスゾーン定義（座標・寸法・種別）、ステータス、マップ/ズーム/タイミング等の定数 |
| **初期データ** | `/src/data/` & `/server/residents.ts` | 初期メンバー情報、スケジュール枠、定型チャット、常駐NPC |

#### 主な型定義 (`src/types.ts`)
- **`Member`**: ID、氏名、アバターURL、ロール、部署、ステータス（オンライン/会議中/集中/離席/休憩）、座標 `(x, y)`、居場所プロパティ (`currentLocationName`, `currentZoneId`)、発言状態 (`isSpeaking`)、音声到達半径 (`voiceRange`)
- **`OfficeZone`**: ゾーンID、名称、種別（`lounge` / `meeting` / `focus` / `studio` / `cafe`）、座標と領域 (`x, y, width, height`)、説明文
- **`ChatMessage`**: メッセージID、送信者情報、本文、タイムスタンプ、リアクション、種別（テキスト / ゾーンアナウンス / システム）

---

### 4. デプロイの仕方 (Deployment Guide)

#### ■ 前提条件
- Node.js 20+ または 22+
- Bun 1.2+（パッケージマネージャー。依存バージョンは `bun.lock` で固定）

#### ■ ローカル開発環境の起動
```bash
# 依存パッケージのインストール
bun install

# 開発サーバー起動 (tsx server.ts が立ち上がり、ポート3000でWeb & WebSocketが利用可能)
bun run dev
```
ブラウザで `http://localhost:3000` にアクセスします。

#### ■ 本番ビルド & 起動 (Production Build)
本プロジェクトは、Viteによるフロントエンド静的ビルドと、`esbuild` による `server.ts` の単一CommonJSファイル化（`dist/server.cjs`）を実行します。

```bash
# 1. ビルド実行 (dist/ ディレクトリに静的アセットと server.cjs が生成されます)
bun run build

# 2. 本番サーバーの起動
bun run start
```

#### ■ Google Cloud Run / Docker へのデプロイ
1. **環境変数の設定**:
   - `NODE_ENV=production`
   - サーバーはポート `3000` で待ち受けます（`server/constants.ts` の `SERVER_PORT`）
2. **Dockerfile 例**:
   ```dockerfile
   FROM oven/bun:1 AS builder
   WORKDIR /app
   COPY package.json bun.lock ./
   RUN bun install --frozen-lockfile
   COPY . .
   RUN bun run build

   FROM oven/bun:1 AS deps
   WORKDIR /app
   COPY package.json bun.lock ./
   RUN bun install --frozen-lockfile --production

   FROM node:22-slim AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY package.json ./
   COPY --from=deps /app/node_modules ./node_modules
   COPY --from=builder /app/dist ./dist
   EXPOSE 3000
   CMD ["node", "dist/server.cjs"]
   ```

---

<a id="english-documentation"></a>
## 🇺🇸 English Documentation

### 1. Overview
This application is an ovice-inspired virtual workspace combining real-time spatial positioning, 2D avatar movement, proximity-based spatial audio simulation, automatic zone/location detection, real-time chat, meeting reservations, and AI-assistant NPCs.

---

### 2. Architecture

The system is built on a robust **Full-Stack architecture (Client-Side SPA + Node.js/Express + Native WebSocket Server)**.

```
                                  [ Client Browser ]
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  │ HTTP / REST API (Port 3000)                   │ WebSocket (ws:// / wss://)
                  ▼                                               ▼
     ┌──────────────────────────┐                    ┌────────────────────────┐
     │ Express HTTP Server      │                    │ WebSocket Server (ws)  │
     │ - Vite SPA Static Serve  │                    │ - Realtime Position    │
     │ - /api/session/users     │                    │ - Profile Sync         │
     │ - /api/session/chats     │                    │ - Live Chat Sync       │
     │ - /api/health            │                    │ - Reaction Sync        │
     └──────────────────────────┘                    └───────────┬────────────┘
                                                                 │
                                                                 ▼
                                                     ┌────────────────────────┐
                                                     │ In-Memory Session Store│
                                                     │ (Active Connected User)│
                                                     └────────────────────────┘
```

#### ■ Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Motion/Animation**: Motion (`motion/react`)
- **Realtime Layer**: `useRealtimeOffice` custom hook handling WebSocket auto-reconnect, position broadcasting, and spatial distance calculation.

#### ■ Backend
- **Runtime**: Node.js (bundled with `esbuild` to `dist/server.cjs`)
- **Server**: Express 4.x
- **WebSocket Engine**: `ws` sharing the same port (`3000`) with HTTP

#### ■ Spatial Audio & Zone Detection Engine
1. **Euclidean Distance Calculation**:
   $$\text{distance} = \sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$$
2. **Proximity Attenuation**:
   - `distance <= voiceRange`: Full volume & connected.
   - `voiceRange < distance <= voiceRange * 1.5`: Linear volume attenuation.
   - Further: Muted / out-of-range.
3. **Zone Resolution**: Automatically resolves the avatar's `(x, y)` coordinate to predefined zone boundaries, updating `currentLocationName` across all connected clients.

---

### 3. Data Management & State

| Scope | Location | Details |
| :--- | :--- | :--- |
| **Client State** | React State (`useState`, `useRef`) | User position, active floor, connected peer list, message list, modal states. |
| **Client Storage** | `sessionStorage` | Per-tab user identity (User ID, display name, role, job class, avatar mode, avatar URL). |
| **Server State** | In-Memory (`Map<string, Member>`) | Live active sockets, position coordinates, speaking state, location properties. |
| **Constants** | `/src/constants/` | Office zones, statuses, map / zoom / timing constants. |
| **Static Seeds** | `/src/data/` & `/server/residents.ts` | Starter members, timetable bookings, sample messages, resident NPCs. |

---

### 4. Deployment Guide

#### ■ Prerequisites
- Node.js 20+ or 22+
- Bun 1.2+ (package manager; dependencies are pinned in `bun.lock`)

#### ■ Local Development
```bash
# Install dependencies
bun install

# Start development server on port 3000
bun run dev
```
Open `http://localhost:3000` in your browser.

#### ■ Production Build & Run
```bash
# 1. Build client and bundle server
bun run build

# 2. Start production server
bun run start
```

#### ■ Cloud Run / Docker Deployment
Set environment variables:
- `NODE_ENV=production`

The server listens on port `3000` (`SERVER_PORT` in `server/constants.ts`).
