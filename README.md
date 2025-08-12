# SEResearcherSuccessGame

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

パ○プロのサクセスモード風にSE研究者を育成するゲームです。

## 技術スタック

### 主要技術

- **フロントエンド**: Next.js 14 + React + TypeScript
- **状態管理**: XState (ステートマシン)
- **スタイリング**: Tailwind CSS
- **音声**: Howler.js
- **データ管理**: TypeScript型定義
- **パッケージマネージャー**: pnpm

## プロジェクト構造

```
se-success-web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx      # アプリレイアウト
│   │   ├── page.tsx        # メインページ
│   │   └── globals.css     # グローバルスタイル
│   ├── components/          # 再利用可能なコンポーネント
│   │   ├── ActionButtons.tsx    # アクションボタン
│   │   ├── ActionLog.tsx        # アクションログ
│   │   ├── ActionNotification.tsx # アクション通知
│   │   ├── GameHeader.tsx       # ゲームヘッダー
│   │   ├── NameInputModal.tsx   # 名前入力モーダル
│   │   ├── RadarChart.tsx       # レーダーチャート
│   │   └── StatBar.tsx          # ステータスバー
│   ├── machines/            # XStateステートマシン
│   │   └── gameMachine.ts   # ゲームの状態管理
│   ├── types/               # TypeScript型定義
│   │   ├── game.d.ts        # ゲーム関連の型
│   │   └── howler.d.ts      # Howler.jsの型定義
│   ├── constants/           # 定数
│   │   └── gameConstants.ts # ゲーム定数
│   └── content/             # ゲームコンテンツ
│       └── scenarios.ts     # シナリオデータ
├── public/                  # 静的ファイル
│   ├── sounds/              # 音声ファイル
│   │   ├── decision.wav     # 決定音
│   │   └── main_theme.wav  # メインテーマ
│   └── images/              # 画像ファイル
└── docker/                  # Docker設定
    ├── web.Dockerfile       # Webアプリ用Dockerfile
    └── docker-entrypoint.sh # Docker起動スクリプト
```

## ゲームの特徴

- **能力システム**: 技術力、研究力、コミュニケーション力、共同研究・交渉能力の4つのステータス
- **アクションシステム**: 様々な行動で能力を向上させる
- **音声演出**: BGMと効果音でゲーム体験を向上
- **モダンUI**: Tailwind CSSを使用した美しいインターフェース

## 開発環境セットアップ

### 1. 依存関係のインストール

```bash
cd se-success-web
pnpm install
```

### 2. 開発サーバーの起動

```bash
pnpm dev
```

ブラウザで http://localhost:3000 にアクセスしてください。

### 3. Docker環境での実行（オプション）

```bash
# Dockerイメージをビルド
docker compose build

# コンテナを起動
docker compose up
```

## 開発の流れ

[![Status](https://img.shields.io/badge/Status-In%20Development-blue?style=for-the-badge)](https://github.com/your-username/se-success-game)

1. ✅ 基本的なプロジェクト構造の構築
2. ✅ コンポーネントの実装
3. ✅ ゲーム状態管理の実装
4. ✅ 音声システムの統合
5. 🔄 UI/UXの改善（進行中）
6. ⏳ ゲームバランスの調整
7. ⏳ テストの実装

## 現在実装済みの機能

- ゲームの基本UI（ヘッダー、ステータスバー、アクションボタン）
- 名前入力モーダル
- アクションログ表示
- レーダーチャートによる能力表示
- 音声システム（BGM、効果音）
- XStateによる状態管理

## 今後の開発予定

- より詳細なゲームロジックの実装
- シナリオシステムの拡充
- セーブ/ロード機能
- モバイル対応
- パフォーマンス最適化

## ライセンス

MIT License
