Ispired by [riv-studio](https://www.riv-studio.com/projects)

自己用 Photoshop 做了一些 mask 來用。

## Prototype

只重現不好實作的部分。

- Mask Blob
- Animation
- Transition

## Problems

### 原站觀察

- 原站的動畫在 `06->01` 及 `06->05` 間有時會跳掉，有可能是 GSAP overwrite 問題？

- 原站點擊後的 transition 應是將圖片放到與目標頁接近的位置，
  並處理 shader 的 progress 去放大 Blob 的範圍，
  到 transition 結束後直接切到目標頁的純 html，
  然後播放新頁面的 intro animation，
  因為結果位置有不一樣所以還是有閃動。
  另外因為背景顏色沒有 transition，
  所以像是第 6 頁的 blob 放大後，直接切到新頁時 blob 的白背景跟 body 背景不一樣。
  切過去時也會覺得有點違和感。

- 原站沒有處理上一頁返回後的 transition，
  但因為看過很酷的實例所以想要試試看。  
  要計算完全相同的位置加上 transition，
  把 scrollbar 取消避免寬度不一樣造成的閃動（但要另外做 scrollbar 的進度提示）。

### What I did

- 我想讓 threejs 元素一直留著，下一頁也能呈現 Shader 特效，
  並且達到完全沒有切頁面的錯覺。

- 在兩頁中都放一個參照位置的 html，並且計算實際的位移，在 transition 的 outro/intro 中切換 threejs 物件參照的元素。

### General

- Mobile View 的前後頁有左右誤差，疑似是 scrollbar 造成。
  用了好久才發現在真的手機上不會發生，待觀察。
- tween color 的時候要注意有沒有 initial color，不然會多一層色轉。
- 加入 Loading Component，一進入頁面的時候會閃一下。背景顏色處理問題。

### GSAP overwrite 問題

---

Update: 這個解法可以，但不是很簡潔的解法，會比較難管理。

可參照[討論內容](https://greensock.com/forums/topic/29470-gsap-page-transitions-in-nextjs/?do=findComment&comment=183254&_rid=138977)

問題不在 overwrite，目前改成 dafault 的`overwrite: true`  
但改回來時，我會遇到 delay 動畫還沒播放新動畫就播放，
導致動畫同時出現的問題，這個反而可以用完全 overwrite 來達成，
後來換一種動畫呈現風格。

---

- outro 設定的動畫會被滾動部分取消。
  設定 global.activeIndex 作為 effect 重發條件。（並未解決）

- 目標頁若滾動，返回時 outro 動畫一部分取消。
  這是因為我讓滾動時更新 threejs 物件位置(position.y，不用滾動更新的話會慢一個 frame)，
  必須在 outro 中加入取消持續更新的邏輯。

- production build 直接看目標頁圖片出不來，
  因為 intro 的 effect 執行時 threejs 的圖片們還沒生成，
  在開發時反而沒事是因為 react strict mode 的關係，
  將切換追蹤目標的動作放到動畫播放時。

- overwrite 問題會一直發生，
  導致邏輯非常紊亂，因為前頁後頁的 intro/outro animation，
  加上 scroll 都會讓 gsap 去操作到相同物件，
  不斷覆寫的情形就要自己去管理 timeline 重新設定的時間，我用 Custom Event 解決。

### Preload 問題

- 用 HTML 的 Image Preload 跟 three.js 的 ImageLoader 是沒有共通的，
  如果兩者都要用就要都做，但我只用在 texture，所以用 Image Preload 等於是多做一件事。

- 要處理 async/await

- 所有 Texture 應該在同一處被 Preload，結束後再開始 render threejs 元素即可。

### Safari 問題

- 上下軸會吃 body 的背景色，加入 transition 才不會很奇怪。

- 在 safari 上會發現 CSS gap 造成行為不一致，
  爬文到 14.1 才支援，但我明明版本超過了還是有問題，
  考慮到相容性直接取消使用 gap 改用 margin，並調整 transition 參數。

- 不支援 dvh，所以要有 vh 做 fallback。

## Todos

- ~~真實 Mobile View 是否都正常？~~

- ~~Refactor~~

- ~~Detail Page 對 three.js 元素增加效果~~

- click 的範圍用 html 的話會因為 mask 不自然，如果能用 raycaster 處理的話？  
  不行，因為我把它放大惹

- AssetManager 流程中加入 HTML Image 的 Preload？(Custom Preloader 的意思)

- 把我的 threejs 打包成 npm package，覺得 threejs 不該放在 template code 裡面。
