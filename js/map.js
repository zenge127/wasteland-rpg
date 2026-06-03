// ===== 512×512 Canvas 瓦片世界地图 =====

// 游戏时间系统 (仅在动作时手动推进)
const GAME_TIME = { day: 1, hour: 6, minute: 0 };

function advanceGameTime(minutes) {
  if (minutes <= 0) return;
  GAME_TIME.minute += minutes;
  while (GAME_TIME.minute >= 60) { GAME_TIME.minute -= 60; GAME_TIME.hour++; }
  while (GAME_TIME.hour >= 24) { GAME_TIME.hour -= 24; GAME_TIME.day++; }
  updateGameClock();
}

function updateGameClock() {
  const el = document.getElementById("game-clock");
  if (el) {
    const h = String(Math.floor(GAME_TIME.hour)).padStart(2, '0');
    const m = String(Math.floor(GAME_TIME.minute)).padStart(2, '0');
    el.textContent = `📅 第${GAME_TIME.day}天 ${h}:${m}`;
  }
}

function updateGameTime(realSeconds) {
  advanceGameTime(realSeconds * (24 * 60 / 5));
}

// 间距函数 (tile距离)
function tileDist(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

class WorldMap {
  constructor(containerId, player) {
    this.player = player;
    this.containerId = containerId;

    // Canvas 元素
    this.canvas = null;
    this.ctx = null;
    this.miniCanvas = null;
    this.miniCtx = null;

    // 视口
    this.viewX = 0; // 视口左上角 tile X
    this.viewY = 0;
    this.zoom = 2;  // 1/2/4 (每tile像素)
    this.tileSize = 2;

    // 地点缓存(WorldMap直接持有引用)
    this.locations = [];

    // 回调
    this.onCityClick = null;
    this.onMapClick = null;
    this.onHoverUpdate = null;

    // 移动动画
    this.isMoving = false;
    this.moveTarget = null;
    this.movePath = [];
    this.moveStepIndex = 0;
    this.moveTimer = 0;

    // 鼠标状态
    this.mouseX = -1;
    this.mouseY = -1;
    this.hoveredLocation = null;

    // 临时目标
    this._pendingTarget = null;

    // 初始化
    this.init();
  }

  init() {
    const container = document.getElementById(this.containerId);
    if (!container) { console.error("Map container not found:", this.containerId); return; }

    // 确保世界数据已生成
    if (!WORLD_DATA) {
      initWorld(Math.floor(Math.random() * 2147483647));
    }
    this.locations = WORLD_DATA.locations || [];

    // 设置玩家起始位置
    const cx = Math.floor(WORLD_DATA.width / 2);
    const cy = Math.floor(WORLD_DATA.height / 2);
    if (!this.player.position || (this.player.position.x === undefined)) {
      this.player.position = { x: cx, y: cy };
    }

    // 创建主Canvas
    this.canvas = document.createElement("canvas");
    this.canvas.id = "world-canvas";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    container.innerHTML = "";
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");

    // 创建小地图Canvas
    this.miniCanvas = document.createElement("canvas");
    this.miniCanvas.id = "world-minimap";
    this.miniCanvas.style.cssText = "position:absolute;bottom:8px;right:8px;width:180px;height:180px;border:2px solid #4a3a2a;border-radius:4px;z-index:10;cursor:pointer;";
    container.appendChild(this.miniCanvas);
    this.miniCtx = this.miniCanvas.getContext("2d");
    this.miniCanvas.width = 180;
    this.miniCanvas.height = 180;

    // 事件
    this.canvas.addEventListener("click", (e) => this._onClick(e));
    this.canvas.addEventListener("mousemove", (e) => this._onMouseMove(e));
    this.canvas.addEventListener("wheel", (e) => { e.preventDefault(); this._onWheel(e); });
    this.miniCanvas.addEventListener("click", (e) => this._onMinimapClick(e));

    // 键盘缩放
    document.addEventListener("keydown", (e) => {
      if (e.key === "+" || e.key === "=") { this.zoomIn(); e.preventDefault(); }
      if (e.key === "-") { this.zoomOut(); e.preventDefault(); }
    });

    // 初始视口居中
    this._centerOnPlayer();
    this.resize();
    this.render();

    updateGameClock();
  }

  _centerOnPlayer() {
    const px = this.player.position.x;
    const py = this.player.position.y;
    const cols = Math.floor(this.canvas.width / this.tileSize);
    const rows = Math.floor(this.canvas.height / this.tileSize);
    this.viewX = px - Math.floor(cols / 2);
    this.viewY = py - Math.floor(rows / 2);
    this._clampView();
  }

  _clampView() {
    const cols = Math.floor(this.canvas.width / this.tileSize);
    const rows = Math.floor(this.canvas.height / this.tileSize);
    this.viewX = Math.max(0, Math.min(WORLD_DATA.width - cols, this.viewX));
    this.viewY = Math.max(0, Math.min(WORLD_DATA.height - rows, this.viewY));
  }

  // ===== 渲染 =====
  render() {
    if (!this.ctx || !WORLD_DATA) return;
    const W = this.canvas.width;
    const H = this.canvas.height;
    const ts = this.tileSize;
    const ctx = this.ctx;

    // 清屏
    ctx.fillStyle = "#080808";
    ctx.fillRect(0, 0, W, H);

    // 计算可见范围
    const startX = Math.max(0, Math.floor(this.viewX));
    const startY = Math.max(0, Math.floor(this.viewY));
    const endX = Math.min(WORLD_DATA.width, startX + Math.ceil(W / ts) + 1);
    const endY = Math.min(WORLD_DATA.height, startY + Math.ceil(H / ts) + 1);

    // 绘制地形
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const sx = Math.floor((x - this.viewX) * ts);
        const sy = Math.floor((y - this.viewY) * ts);
        const idx = y * WORLD_DATA.width + x;
        const explored = WORLD_DATA.explored[idx];

        if (!explored) {
          ctx.fillStyle = "#0a0a0a";
          ctx.fillRect(sx, sy, ts, ts);
        } else {
          const tile = WORLD_DATA.tiles[idx];
          ctx.fillStyle = TILE_COLORS[tile] || "#333";
          ctx.fillRect(sx, sy, ts, ts);
        }
      }
    }

    // 绘制地点图标
    for (const loc of this.locations) {
      const idx = loc.y * WORLD_DATA.width + loc.x;
      if (!WORLD_DATA.explored[idx]) continue;
      const sx = Math.floor((loc.x - this.viewX) * ts);
      const sy = Math.floor((loc.y - this.viewY) * ts);
      if (sx < -10 || sx > W + 10 || sy < -10 || sy > H + 10) continue;

      // 光环
      ctx.fillStyle = loc.type === "dungeon" ? "rgba(255,60,60,0.25)" :
                     loc.type === "city" ? "rgba(255,200,60,0.3)" :
                     "rgba(200,200,200,0.2)";
      ctx.beginPath();
      ctx.arc(sx + ts/2, sy + ts/2, ts * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // 图标文字
      const iconSize = Math.max(8, ts * 2);
      ctx.font = `${iconSize}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(loc.icon, sx + ts/2, sy + ts/2 - ts * 0.5);

      // 名称（缩放≥2时显示）
      if (ts >= 2 && loc.type === "city") {
        ctx.font = `${Math.max(6, ts * 3)}px sans-serif`;
        ctx.fillStyle = "#f0c040";
        ctx.fillText(loc.name, sx + ts/2, sy + ts/2 + ts * 1.2);
      }
    }

    // 绘制玩家
    const px = Math.floor((this.player.position.x - this.viewX) * ts);
    const py = Math.floor((this.player.position.y - this.viewY) * ts);
    const playerSize = Math.max(3, ts * 1.8);

    // 光环
    const glowGrad = ctx.createRadialGradient(px + ts/2, py + ts/2, 0, px + ts/2, py + ts/2, ts * 4);
    glowGrad.addColorStop(0, "rgba(240,200,40,0.8)");
    glowGrad.addColorStop(0.5, "rgba(240,200,40,0.2)");
    glowGrad.addColorStop(1, "rgba(240,200,40,0)");
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(px + ts/2, py + ts/2, ts * 4, 0, Math.PI * 2);
    ctx.fill();

    // 身体
    ctx.fillStyle = "#f0d060";
    ctx.fillRect(px + ts * 0.2, py + ts * 0.15, ts * 0.6, ts * 0.7);
    // 头
    ctx.fillStyle = "#f0d060";
    ctx.beginPath();
    ctx.arc(px + ts/2, py + ts * 0.15, ts * 0.3, 0, Math.PI * 2);
    ctx.fill();
    // 眼睛
    ctx.fillStyle = "#000";
    ctx.fillRect(px + ts * 0.35, py + ts * 0.08, ts * 0.15, ts * 0.1);

    // 更新hover地点
    this._checkHover();

    // 渲染小地图
    this._renderMinimap();
  }

  _renderMinimap() {
    const mw = 180, mh = 180;
    const ctx = this.miniCtx;
    const scaleX = mw / WORLD_DATA.width;
    const scaleY = mh / WORLD_DATA.height;

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, mw, mh);

    // 地形缩略
    const imgData = ctx.createImageData(mw, mh);
    for (let my = 0; my < mh; my++) {
      for (let mx = 0; mx < mw; mx++) {
        const wx = Math.floor(mx / scaleX);
        const wy = Math.floor(my / scaleY);
        const idx = wy * WORLD_DATA.width + wx;
        const i = (my * mw + mx) * 4;

        if (WORLD_DATA.explored[idx]) {
          const tile = WORLD_DATA.tiles[idx];
          const hex = TILE_COLORS[tile] || "#333";
          const r = parseInt(hex.slice(1,3), 16);
          const g = parseInt(hex.slice(3,5), 16);
          const b = parseInt(hex.slice(5,7), 16);
          imgData.data[i] = r;
          imgData.data[i+1] = g;
          imgData.data[i+2] = b;
          imgData.data[i+3] = 200;
        } else {
          imgData.data[i] = 8;
          imgData.data[i+1] = 8;
          imgData.data[i+2] = 8;
          imgData.data[i+3] = 255;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // 地点标记
    for (const loc of this.locations) {
      const idx = loc.y * WORLD_DATA.width + loc.x;
      if (!WORLD_DATA.explored[idx]) continue;
      const mx = Math.floor(loc.x * scaleX);
      const my = Math.floor(loc.y * scaleY);
      ctx.fillStyle = loc.type === "dungeon" ? "#ff4040" :
                     loc.type === "city" ? "#f0c040" : "#aaa";
      ctx.fillRect(mx - 1, my - 1, 3, 3);
    }

    // 玩家位置
    const pmx = Math.floor(this.player.position.x * scaleX);
    const pmy = Math.floor(this.player.position.y * scaleY);
    ctx.fillStyle = "#fff";
    ctx.fillRect(pmx - 2, pmy - 2, 5, 5);

    // 视口框
    const cols = Math.floor(this.canvas.width / this.tileSize);
    const rows = Math.floor(this.canvas.height / this.tileSize);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      Math.floor(this.viewX * scaleX),
      Math.floor(this.viewY * scaleY),
      Math.ceil(cols * scaleX),
      Math.ceil(rows * scaleY)
    );
  }

  // ===== 交互 =====
  _onClick(e) {
    if (this.isMoving) return;
    const rect = this.canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const tileX = Math.floor(cx / this.tileSize + this.viewX);
    const tileY = Math.floor(cy / this.tileSize + this.viewY);

    if (tileX < 0 || tileX >= WORLD_DATA.width || tileY < 0 || tileY >= WORLD_DATA.height) return;

    const idx = tileY * WORLD_DATA.width + tileX;
    if (!WORLD_DATA.explored[idx]) return;

    // 检查是否点击了地点
    const clickLoc = this.locations.find(loc => {
      const d = tileDist(tileX, tileY, loc.x, loc.y);
      return d < 3;
    });

    if (clickLoc) {
      this._showLocationPopup(e.clientX, e.clientY, clickLoc);
      return;
    }

    // 检查不可通行
    const tile = WORLD_DATA.tiles[idx];
    if (!this._canPassTile(tile)) {
      if (this.onMapClick) {
        const tileName = TILE_NAMES[tile] || "未知";
        const hint = (tile === TILE.OCEAN || tile === TILE.DEEP_OCEAN) ? "需要船只才能渡海。" : "";
        this.onMapClick({ type: "blocked", msg: `🧱 ${tileName}无法通行。${hint}` });
      }
      return;
    }

    // 弹出移动确认
    this._showMovePopup(e.clientX, e.clientY, tileX, tileY);
  }

  _showLocationPopup(screenX, screenY, loc) {
    const dist = Math.floor(tileDist(this.player.position.x, this.player.position.y, loc.x, loc.y));
    const near = dist <= 3;
    const terrain = TILE_NAMES[this._getTile(loc.x, loc.y)] || "未知";

    const el = document.createElement("div");
    el.className = "map-popup";
    el.style.cssText = `position:fixed;left:${screenX}px;top:${screenY}px;z-index:500;
      background:#2a2010;border:2px solid #4a3a2a;border-radius:6px;padding:12px;min-width:200px;
      box-shadow:0 4px 20px rgba(0,0,0,0.8);font-size:12px;color:#c8b87d;`;

    const starStr = loc.type === "city" ? '★'.repeat(loc.size) + '☆'.repeat(5 - loc.size) : "";
    el.innerHTML = `
      <h3 style="color:#f0c040;margin:0 0 4px;font-size:15px;">${loc.icon} ${loc.name}</h3>
      ${starStr ? `<p style="color:#8a8a7a;margin:2px 0;font-size:11px;">${starStr}</p>` : ""}
      <p style="color:#8a8a7a;margin:2px 0;font-size:11px;">${loc.type === "city" ? "城市" : loc.type === "village" ? "村庄" : loc.type === "outpost" ? "据点" : "洞穴/副本"}</p>
      <p style="color:#c8b87d;margin:4px 0;font-size:12px;">${loc.desc}</p>
      <p style="color:${near ? '#60c060' : '#ffc040'};font-size:11px;margin:6px 0;">📏 距离: ${dist}格 ${near ? '(附近)' : ''}</p>
      <div style="margin-top:8px;display:flex;gap:6px;">
        <button id="popup-move-${loc.id}" style="flex:1;padding:6px;background:#3a2a10;border:1px solid #4a3a2a;color:#c8b87d;font-family:inherit;font-size:11px;cursor:pointer;border-radius:2px;">🚶 移动到此处</button>
        ${near && loc.type !== "dungeon" ? `<button id="popup-enter-${loc.id}" style="flex:1;padding:6px;background:#3a2a10;border:1px solid #60c060;color:#60c060;font-family:inherit;font-size:11px;cursor:pointer;border-radius:2px;">🏙️ 进入</button>` : ''}
        ${near && loc.type === "dungeon" ? `<button id="popup-enter-${loc.id}" style="flex:1;padding:6px;background:#3a2a10;border:1px solid #ff6060;color:#ff6060;font-family:inherit;font-size:11px;cursor:pointer;border-radius:2px;">🏚️ 进入副本</button>` : ''}
      </div>
      <button id="popup-close-${loc.id}" style="display:block;margin:8px auto 0;background:none;border:none;color:#5a5a4a;font-family:inherit;font-size:11px;cursor:pointer;">关闭</button>`;

    document.body.appendChild(el);

    document.getElementById(`popup-close-${loc.id}`).onclick = () => el.remove();
    document.getElementById(`popup-move-${loc.id}`).onclick = () => {
      el.remove();
      this._startMoveTo(loc.x, loc.y);
    };
    const enterBtn = document.getElementById(`popup-enter-${loc.id}`);
    if (enterBtn) {
      enterBtn.onclick = () => {
        el.remove();
        if (loc.type === "dungeon") {
          if (window.gameInstance) window.gameInstance.enterDungeon();
        } else {
          // 转换为类似旧city格式
          const cityData = {
            name: loc.name, size: loc.size || 1, desc: loc.desc,
            type: loc.type, x: loc.x, y: loc.y, country: "废土"
          };
          if (this.onCityClick) this.onCityClick(cityData);
        }
      };
    }

    // 点击其他地方关闭
    const closeHandler = (ev) => {
      if (!el.contains(ev.target)) {
        el.remove();
        document.removeEventListener("click", closeHandler);
      }
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 10);
  }

  _showMovePopup(screenX, screenY, tileX, tileY) {
    const dist = Math.floor(tileDist(this.player.position.x, this.player.position.y, tileX, tileY));
    const tile = this._getTile(tileX, tileY);
    const terrain = TILE_NAMES[tile] || "未知";
    const moveCostPerTile = this._getMoveCost(tile);
    const etaMin = dist * moveCostPerTile;

    const el = document.createElement("div");
    el.className = "map-popup";
    el.style.cssText = `position:fixed;left:${screenX}px;top:${screenY}px;z-index:500;
      background:#2a2010;border:2px solid #4a3a2a;border-radius:6px;padding:12px;min-width:160px;
      box-shadow:0 4px 20px rgba(0,0,0,0.8);font-size:12px;color:#c8b87d;text-align:center;`;

    el.innerHTML = `
      <p style="font-weight:bold;margin-bottom:4px;">🗺️ 目的地信息</p>
      <p style="color:#8a8a7a;font-size:11px;">地形: ${terrain} | 距离: ${dist}格</p>
      <p style="color:#5a5a4a;font-size:10px;">预计耗时: ~${etaMin}分钟</p>
      <div style="margin-top:8px;display:flex;gap:6px;justify-content:center;">
        <button id="popup-hexmove" style="padding:6px 12px;background:#3a2a10;border:1px solid #4a3a2a;color:#f0c040;font-family:inherit;font-size:12px;cursor:pointer;border-radius:3px;">🚶 移动到此</button>
        <button id="popup-directmove" style="padding:6px 12px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;font-family:inherit;font-size:11px;cursor:pointer;border-radius:3px;">⚡ 快速移动</button>
        <button id="popup-cancel" style="padding:6px 12px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;font-family:inherit;font-size:12px;cursor:pointer;border-radius:3px;">取消</button>
      </div>`;

    document.body.appendChild(el);

    document.getElementById("popup-cancel").onclick = () => el.remove();
    document.getElementById("popup-hexmove").onclick = () => {
      el.remove();
      if (window.startHexTravel) {
        window.startHexTravel(tileX, tileY, dist, terrain);
      }
    };
    document.getElementById("popup-directmove").onclick = () => {
      el.remove();
      this._startMoveTo(tileX, tileY);
    };

    const closeHandler = (ev) => {
      if (!el.contains(ev.target)) { el.remove(); document.removeEventListener("click", closeHandler); }
    };
    setTimeout(() => document.addEventListener("click", closeHandler), 10);
  }

  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  _checkHover() {
    if (this.mouseX < 0 || this.mouseY < 0) return;
    const tileX = Math.floor(this.mouseX / this.tileSize + this.viewX);
    const tileY = Math.floor(this.mouseY / this.tileSize + this.viewY);
    const hoverLoc = this.locations.find(loc => tileDist(tileX, tileY, loc.x, loc.y) < 3);
    if (hoverLoc !== this.hoveredLocation) {
      this.hoveredLocation = hoverLoc;
      if (this.onHoverUpdate) this.onHoverUpdate(hoverLoc);
    }
  }

  _onWheel(e) {
    if (e.deltaY < 0) this.zoomIn();
    else this.zoomOut();
  }

  _onMinimapClick(e) {
    const rect = this.miniCanvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const scaleX = 180 / WORLD_DATA.width;
    const scaleY = 180 / WORLD_DATA.height;
    const wx = Math.floor(mx / scaleX);
    const wy = Math.floor(my / scaleY);

    // 跳转视口
    const cols = Math.floor(this.canvas.width / this.tileSize);
    const rows = Math.floor(this.canvas.height / this.tileSize);
    this.viewX = Math.max(0, Math.min(WORLD_DATA.width - cols, wx - Math.floor(cols / 2)));
    this.viewY = Math.max(0, Math.min(WORLD_DATA.height - rows, wy - Math.floor(rows / 2)));
    this.render();
  }

  // ===== 缩放 =====
  zoomIn() {
    const newZoom = Math.min(4, this.zoom * 2);
    if (newZoom !== this.zoom) {
      this.zoom = newZoom;
      this.tileSize = newZoom;
      this._clampView();
      this.render();
    }
  }

  zoomOut() {
    const newZoom = Math.max(1, this.zoom / 2);
    if (newZoom !== this.zoom) {
      this.zoom = newZoom;
      this.tileSize = newZoom;
      this._clampView();
      this.render();
    }
  }

  // ===== 移动 =====
  _startMoveTo(targetX, targetY) {
    if (this.isMoving) return;
    const startX = this.player.position.x;
    const startY = this.player.position.y;
    const dist = tileDist(startX, startY, targetX, targetY);

    if (dist < 1) return;

    // 检查目的地tile以确定移动成本
    const destTile = this._getTile(targetX, targetY);
    const moveCostPerTile = this._getMoveCost(destTile);

    // 简易路径：直线插值
    const steps = Math.ceil(dist);
    this.movePath = [];
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      this.movePath.push({
        x: Math.round(startX + (targetX - startX) * t),
        y: Math.round(startY + (targetY - startY) * t),
      });
    }
    this.moveStepIndex = 0;

    // 游戏时间
    advanceGameTime(Math.floor(dist * moveCostPerTile));
    if (this.onMapClick) {
      this.onMapClick({ type: "move", tileX: targetX, tileY: targetY, dist: Math.floor(dist), terrain: TILE_NAMES[destTile] || "未知" });
    }

    this.isMoving = true;
    this._animateMove();
  }

  _animateMove() {
    if (this.moveStepIndex >= this.movePath.length) {
      this.isMoving = false;
      this._centerOnPlayer();
      this.render();
      // 探索周围
      this._exploreAround(this.player.position.x, this.player.position.y, 3);
      // 随机遭遇
      if (Math.random() < 0.08 && this.onMapClick) {
        setTimeout(() => { if (this.onMapClick) this.onMapClick({ type: "encounter" }); }, 500);
      }
      return;
    }

    const step = this.movePath[this.moveStepIndex];
    // 检查通行性
    const tile = this._getTile(step.x, step.y);
    if (!this._canPassTile(tile)) {
      this.isMoving = false;
      this._centerOnPlayer();
      this.render();
      if (this.onMapClick) {
        this.onMapClick({ type: "blocked", msg: `🧱 ${TILE_NAMES[tile]}阻挡了去路。` });
      }
      return;
    }

    this.player.position.x = step.x;
    this.player.position.y = step.y;
    this._exploreAround(step.x, step.y, 2);
    this.moveStepIndex++;

    // 平滑移动视口
    this._centerOnPlayer();
    this.render();

    const speed = 60 + Math.floor(Math.random() * 40); // ms per tile
    setTimeout(() => this._animateMove(), speed);
  }

  _exploreAround(cx, cy, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x >= 0 && x < WORLD_DATA.width && y >= 0 && y < WORLD_DATA.height) {
          WORLD_DATA.explored[y * WORLD_DATA.width + x] = 1;
        }
      }
    }
  }

  // 键盘移动 (tile by tile)
  movePlayerByDirection(dx, dy) {
    if (this.isMoving) return false;
    const nx = this.player.position.x + dx;
    const ny = this.player.position.y + dy;
    if (nx < 0 || nx >= WORLD_DATA.width || ny < 0 || ny >= WORLD_DATA.height) return false;

    const tile = this._getTile(nx, ny);
    if (!this._canPassTile(tile)) {
      if (this.onMapClick) {
        const hint = (tile === TILE.OCEAN || tile === TILE.DEEP_OCEAN) ? "需要船只才能渡海。" : "";
        this.onMapClick({ type: "blocked", msg: `🧱 ${TILE_NAMES[tile]}无法通行。${hint}` });
      }
      return false;
    }

    this.player.position.x = nx;
    this.player.position.y = ny;
    this._exploreAround(nx, ny, 2);
    const moveCost = this._getMoveCost(tile);
    advanceGameTime(moveCost + Math.floor(Math.random() * 10));

    if (this.onMapClick) {
      this.onMapClick({ type: "move", tileX: nx, tileY: ny, dist: 1, terrain: TILE_NAMES[tile] });
    }

    this._centerOnPlayer();
    this.render();

    // 随机遭遇
    if (Math.random() < 0.04 && this.onMapClick) {
      setTimeout(() => { if (this.onMapClick) this.onMapClick({ type: "encounter" }); }, 300);
    }
    return true;
  }

  // ===== 查询 =====
  _getTile(x, y) {
    if (x < 0 || x >= WORLD_DATA.width || y < 0 || y >= WORLD_DATA.height) return TILE.OCEAN;
    return WORLD_DATA.tiles[y * WORLD_DATA.width + x];
  }

  // 检查tile是否可通行（考虑船只）
  _canPassTile(tile) {
    if (TILE_PASSABLE[tile]) return true;
    // 海洋/深海/河流需要船只
    if ((tile === TILE.OCEAN || tile === TILE.DEEP_OCEAN || tile === TILE.RIVER) && this.player.hasBoat) {
      return true;
    }
    return false;
  }

  _getMoveCost(tile) {
    // 海洋移动较慢
    if (tile === TILE.OCEAN || tile === TILE.DEEP_OCEAN) return 4; // 海上每格4分钟
    if (tile === TILE.RIVER) return 3;
    return 2; // 陆地每格2分钟
  }

  getTerrainAtPlayer() {
    const x = this.player.position.x;
    const y = this.player.position.y;
    const tile = this._getTile(x, y);
    return {
      terrain: TILE_NAMES[tile] || "未知",
      tile,
      x, y,
    };
  }

  findNearbyCity(maxDist) {
    maxDist = maxDist || 3;
    const px = this.player.position.x;
    const py = this.player.position.y;
    for (const loc of this.locations) {
      if (loc.type === "city" || loc.type === "village") {
        if (tileDist(px, py, loc.x, loc.y) <= maxDist) {
          return {
            name: loc.name,
            size: loc.size || 1,
            desc: loc.desc,
            type: loc.type,
            x: loc.x, y: loc.y,
            country: "废土",
          };
        }
      }
    }
    return null;
  }

  findNearbyDungeon(maxDist) {
    maxDist = maxDist || 3;
    const px = this.player.position.x;
    const py = this.player.position.y;
    for (const loc of this.locations) {
      if (loc.type === "dungeon") {
        if (tileDist(px, py, loc.x, loc.y) <= maxDist) {
          return {
            name: loc.name,
            desc: loc.desc,
            type: "dungeon",
            x: loc.x, y: loc.y,
          };
        }
      }
    }
    return null;
  }

  // ===== 视图控制 =====
  centerOn(x, y, zoom) {
    if (x !== undefined) this.player.position.x = x;
    if (y !== undefined) this.player.position.y = y;
    if (zoom) { this.zoom = zoom; this.tileSize = zoom; }
    this._centerOnPlayer();
    this.render();
  }

  resize() {
    if (!this.canvas) return;
    const container = document.getElementById(this.containerId);
    if (!container) return;
    const rect = container.getBoundingClientRect();
    this.canvas.width = rect.width || 800;
    this.canvas.height = rect.height || 600;
    this._clampView();
    this.render();
  }
}
