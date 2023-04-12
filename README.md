The idea and mask images are from [riv-studio](https://www.riv-studio.com/projects)

## prototype

只重現不好實作的部分。

- mask blob
- animation
- transitioin

## problems

- 原站的動畫在 06->01 及 06->05 間有時會跳掉，在重現過程中沒想到為什麼會造成這現象，有可能是 gsap overwrite 問題？但只是滑動的話應該沒有其他東西會觸發，有想是不是滑動行為有造成 rerender 然後 useEffect 中的 transition 被觸發了。

- 原站點擊後的 transition 是將圖片放到與目標頁接近的位置，並處理 shader 的 progress 去放大 Blob 的範圍，到 transition 結束後直接切到目標頁的純 html，然後播放新頁面的 intro animation，過程中因為位置有不一樣所以還是有閃動。

- 我的處理方式是「讓 threejs 元素一直留著，而且這樣下一頁我也能玩 threejs 的特效」，在兩頁中都放一個參照位置的 html，並且計算實際的位移，在 transition 的 outro/intro 中切換 threejs 物件參照的元素。

- 但這樣處理 Responsive 就有點麻煩。

- 原站沒有處理上一頁返回後的 transition，但因為看過很酷的實例所以想要試試看。總之要計算完全相同的位置加上 transition，把 scrollbar 取消避免寬度不一樣造成的閃動（但要另外做 scrollbar 的進度提示）。transition 不依賴 gsap 以外函式庫。

- outro 設定的動畫會被滾動部分取消。設定 global.activeIndex 作為 effect 重發條件。

- 目標頁若滾動，返回時 outro 動畫一部分取消。這是因為我讓滾動時更新 threejs 物件位置(position.y，不用滾動更新的話會慢)，在 outro 中加入取消持續更新的邏輯後解決。

- Mobile View 的前後頁有誤差，疑似是 scrollbar 造成。用了好久才發現在真的手機上不會發生，待觀察。

- tween color 的時候要注意有沒有 initial color。

- production build 直接看目標頁圖片出不來，因為 intro 的 effect 執行時 threejs 的圖片們還沒生成，在 develope 階段反而沒事是因為 react strict mode 的關係，生命週期果然還是 react 裡最重要的一環。

## Todos

- 真實 Mobile View 是否都正常？

- Refactor
