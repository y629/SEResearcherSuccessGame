# SE 研究者 Success Game

パワプロのサクセスモードをSE研究者向けにアレンジしたゲームです。

## 技術スタック

- **フロントエンド**: Next.js 14 + React + TypeScript
- **状態管理**: XState + Zustand
- **スタイリング**: Tailwind CSS + shadcn/ui
- **音声**: Howler.js
- **2D演出**: PixiJS
- **データ**: YAML/JSON + Zod

## 開発環境セットアップ

### 1. Docker環境の構築

```bash
# Dockerイメージをビルド
docker compose build

# コンテナを起動してシェルに入る
docker compose run --rm web bash
```

### 2. プロジェクト初期化（コンテナ内で実行）

```bash
# Next.jsアプリを作成
pnpm dlx create-next-app@latest . \
  --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --no-git

# 必要なライブラリをインストール
pnpm add howler xstate zustand zod yaml
pnpm add -D @types/howler vitest @testing-library/react @testing-library/jest-dom jsdom playwright

# Playwrightのセットアップ（E2Eテスト用）
npx playwright install
```

### 3. 開発サーバーの起動

```bash
# コンテナ内で
pnpm dev

# または、ホスト側から
docker compose up
```

ブラウザで http://localhost:3000 にアクセスしてください。

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
├── components/          # 再利用可能なコンポーネント
├── machines/            # XStateステートマシン
├── stores/              # Zustandストア
├── types/               # TypeScript型定義
└── utils/               # ユーティリティ関数

public/
├── sounds/              # 音声ファイル
└── images/              # 画像ファイル

packages/                # 将来的なモノレポ構成
├── game-core/           # ゲームロジック
├── content/             # ゲームデータ
└── schemas/             # データスキーマ
```

## ゲームの特徴

- **週単位の進行**: 研究者の日常を週単位でシミュレート
- **能力育成**: 論文執筆、実験、申請などの行動で能力を向上
- **イベントシステム**: 学会採択、査読、計算資源問題などのランダムイベント
- **時間管理**: 限られた時間内で効率的に成果を上げる
- **音声演出**: BGMと効果音でゲーム体験を向上

## 開発の流れ

1. 基本的な週サイクルの実装
2. 行動システムの実装
3. イベントシステムの実装
4. 音声システムの統合
5. UI/UXの改善
6. バランス調整
7. テストの実装

## ライセンス

MIT License
