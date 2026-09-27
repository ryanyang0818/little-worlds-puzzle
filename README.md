# 小小世界 · 立體拼圖室

一款可以旋轉、拖曳拼圖與點擊互動的 3D 網頁遊戲。

## 開始玩

https://ryanyang0818.github.io/little-worlds-puzzle/

- 六個主題，共 120 件小物：甜點、太空、海底、森林、恐龍博物館、遊樂園。
- 拖曳小物放到相同的灰色形狀，放錯會彈回。
- 點擊拼好的物件欣賞不同動作，火箭可以噴火升空。
- 支援提示、音效、全螢幕專心模式及鍵盤操作。
- 進度保存在自己的瀏覽器，不需要帳號或資料庫。

## 本機啟動

使用 Bun 執行 `bun server.mjs`，也可使用 Node.js 執行 `node server.mjs`。
開啟 http://127.0.0.1:8765/。

## 部署

GitHub Pages 從 main 分支的根目錄提供靜態檔案，不需要建置。

## 第三方授權

Three.js 0.180.0 使用 MIT 授權，見 vendor/THREE-LICENSE.txt。
