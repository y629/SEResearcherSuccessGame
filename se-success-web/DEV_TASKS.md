# Cursor用開発タスクリスト（能力値ランダム生成＆行動システム）

## 0) 概要
- Next.js(現行デモ)に**主人公ステータス**と**行動ボタン**を追加。
- 初期化で能力値をランダム生成（0–100）。
- ボタン押下で対応する能力値とスタミナが増減。履歴ログ表示。
- 1ファイル完結でもOK（最小）。余裕があれば型と定数を分離。

## 1) 型とデータモデル
- 9能力（キーは英語、UI表示は日本語）  
  - writing（論文執筆力）  
  - coding（実験・実装力）  
  - presentation（プレゼン力）  
  - collaboration（共同研究・交渉力）  
  - stamina（研究体力）※これは能力でもありリソース  
  - catchup（最新技術キャッチアップ力）  
  - english（英語力）  
  - communication（コミュ力）
  - insight（ひらめき力）
- 能力値は0–100。初期化は`Math.floor( Math.random()*21 ) + 40`（40–60の範囲、ブレすぎない）。

## 2) 行動定義（最小6つ：能力対応+追加2つ）
- 行動は「名前・説明・効果（各能力のΔ）・スタミナ消費」を持つ。
- 効果はオブジェクトで差分を記述。存在しないキーは0扱い。
- マイナスは下限0、プラスは上限100にクランプ。

**最小セット**
1. セミナー参加  
   - effect: { presentation:+3, communication:+2, catchup:+2, insight:+1, stamina:-5 }
2. コーディング集中  
   - effect: { coding:+5, catchup:+1, insight:+2, stamina:-8 }
3. 論文執筆  
   - effect: { writing:+5, english:+2, insight:+3, stamina:-7 }
4. 国際論文読み（英語）  
   - effect: { english:+4, catchup:+3, insight:+2, stamina:-6 }
5. 休む（追加アクション1）  
   - effect: { stamina:+12 }
6. 懇親会参加（追加アクション2）  
   - effect: { communication:+5, collaboration:+2, insight:+1, stamina:-6 }

## 3) 状態管理と更新ロジック
- ページローカルで`useState`ベース（最小）。  
  - `const [stats, setStats] = useState<Stats>(initStats());`  
  - `const [week, setWeek] = useState(1);`  
  - `const [log, setLog] = useState<string[]>([]);`
- `applyAction(action)`で  
  - スタミナが不足（< 消費）なら実行不可。  
  - 各能力を加算し0–100にクランプ。  
  - `week+1`に進める。  
  - ログに「Week X: 行動名 / 変化要約」をpush。

## 4) UI
- 上部：タイトル、Week表示、スタミナ表示。
- 中央：9能力の水平バー（%表示付き）。
- 下部：行動ボタン（6個）。
- 右 or 下：実行ログ。

## 5) 制約
- スタミナが行動コスト未満ならボタン無効化（休むは例外）。
- 能力値は0–100でクランプ。

## 6) ファイル構成（最小）
```
src/app/page.tsx        ← 全部まとめて実装
```
※余裕があれば型や定数を分離。

## 7) 受け入れ基準
- 初回表示で9能力が40–60のランダム値。
- ボタン押下で能力値・週数・ログが更新。
- スタミナ不足時はボタン無効化。
- 休むはいつでも実行可能。
