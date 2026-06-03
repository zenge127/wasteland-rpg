// ===== 六边形移动地图系统 =====
// 64×64 点尖六边形格子，随机生成地形和内容物

const HEX_TERRAIN = {
  plains:   { id: 0, name: "平原",   color: "#3a4a20", icon: "🟫", moveCost: 1, passable: true,  desc: "开阔的平原，易于通行" },
  forest:   { id: 1, name: "森林",   color: "#1a3a10", icon: "🌲", moveCost: 2, passable: true,  desc: "茂密的变异森林" },
  mountain: { id: 2, name: "山脉",   color: "#4a4a3a", icon: "⛰️", moveCost: 0, passable: false, desc: "陡峭的山脉，无法通行" },
  lake:     { id: 3, name: "湖泊",   color: "#1a2a5a", icon: "🌊", moveCost: 0, passable: false, desc: "辐射污染的湖泊" },
  ruins:    { id: 4, name: "遗迹",   color: "#5a4a2a", icon: "🏛️", moveCost: 3, passable: true,  desc: "远古文明的废墟" },
  house:    { id: 5, name: "房屋",   color: "#3a3a2a", icon: "🏚️", moveCost: 1, passable: true,  desc: "废弃的幸存者小屋" },
  road:     { id: 6, name: "道路",   color: "#5a5a3a", icon: "🛤️", moveCost: 0.5, passable: true, desc: "残破的旧时代公路" },
};

const HEX_CONTENT = {
  none:    { id: 0, name: "无",     icon: "",  encounter: false },
  enemy:   { id: 1, name: "敌人",   icon: "👹", encounter: true,  desc: "有敌人在此徘徊" },
  chest:   { id: 2, name: "宝箱",   icon: "📦", encounter: true,  desc: "一个被遗弃的宝箱" },
  herbs:   { id: 3, name: "药草",   icon: "🌿", encounter: true,  desc: "稀有的变异药草" },
  scrap:   { id: 4, name: "废料",   icon: "🔩", encounter: true,  desc: "散落的金属废料" },
  trader:  { id: 5, name: "商人",   icon: "🧑‍💼", encounter: true, desc: "一位流浪商人" },
  shrine:  { id: 6, name: "神龛",   icon: "⛩️", encounter: true,  desc: "古老的神秘神龛" },
};

// 敌人等级组
const HEX_ENEMY_POOLS = {
  low:  ["mutant_rat","bandit_thug","mutant_dog"],
  mid:  ["scavenger","mutant_warrior","bandit_leader","glowing_ghoul","security_bot"],
  high: ["wasteland_mage","deathclaw","assault_mech","toxic_shaman"],
};

class HexMap {
  constructor(playerLv, worldDist) {
    this.width = 64;
    this.height = 64;
    this.playerLv = playerLv;
    this.worldDist = worldDist; // 对应的世界地图距离(km)

    this.grid = [];       // [y][x] = { terrain: HEX_TERRAIN key, content: HEX_CONTENT key, enemyId: null }
    this.explored = [];   // [y][x] = bool
    this.playerX = 32;    // 玩家起始位置（中心）
    this.playerY = 32;
    this.exitX = 0;       // 出口位置
    this.exitY = 0;
    this.steps = 0;       // 已走步数
    this.totalTime = 0;   // 累计消耗游戏时间(分钟)
    this.log = [];        // 移动日志

    this.generate();
  }

  generate() {
    // 初始化网格
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = [];
      this.explored[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = { terrain: "plains", content: "none", enemyId: null };
        this.explored[y][x] = false;
      }
    }

    // 使用随机种子生成地形簇
    this._generateTerrainClusters("mountain", 8 + Math.floor(Math.random() * 10));
    this._generateTerrainClusters("lake", 5 + Math.floor(Math.random() * 7));
    this._generateTerrainClusters("forest", 10 + Math.floor(Math.random() * 12));
    this._generateTerrainClusters("ruins", 3 + Math.floor(Math.random() * 4));
    this._generateTerrainClusters("house", 4 + Math.floor(Math.random() * 5));

    // 生成道路网络
    this._generateRoads();

    // 放置内容物
    this._placeContent("enemy", 15 + Math.floor(Math.random() * 15));
    this._placeContent("chest", 5 + Math.floor(Math.random() * 8));
    this._placeContent("herbs", 8 + Math.floor(Math.random() * 10));
    this._placeContent("scrap", 10 + Math.floor(Math.random() * 12));
    this._placeContent("trader", 1 + Math.floor(Math.random() * 2));
    this._placeContent("shrine", 1 + Math.floor(Math.random() * 2));

    // 放置出口（在地图边缘）
    this._placeExit();

    // 清除玩家起始区域的内容物
    this._clearStartArea();

    // 标记起始区域为已探索
    this._exploreAround(this.playerX, this.playerY, 3);
  }

  _generateTerrainClusters(terrainKey, count) {
    for (let i = 0; i < count; i++) {
      const cx = 5 + Math.floor(Math.random() * (this.width - 10));
      const cy = 5 + Math.floor(Math.random() * (this.height - 10));
      const size = 2 + Math.floor(Math.random() * 6);
      for (let dy = -size; dy <= size; dy++) {
        for (let dx = -size; dx <= size; dx++) {
          const x = cx + dx, y = cy + dy;
          if (x < 0 || x >= this.width || y < 0 || y >= this.height) continue;
          if (this.grid[y][x].terrain !== "plains") continue;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist <= size && Math.random() < 0.7) {
            this.grid[y][x].terrain = terrainKey;
          }
        }
      }
    }
  }

  _generateRoads() {
    // 生成几条主干道
    const roadCount = 2 + Math.floor(Math.random() * 3);
    for (let r = 0; r < roadCount; r++) {
      let x = Math.floor(Math.random() * this.width);
      let y = Math.floor(Math.random() * this.height);
      const len = 30 + Math.floor(Math.random() * 40);
      const dx = Math.random() > 0.5 ? 1 : (Math.random() > 0.5 ? -1 : 0);
      const dy = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : (Math.random() > 0.5 ? 1 : 0);
      for (let i = 0; i < len; i++) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          const t = this.grid[y][x];
          if (t.terrain !== "mountain" && t.terrain !== "lake") {
            t.terrain = "road";
          }
        }
        x += dx;
        y += dy;
        if (Math.random() < 0.1) { x += Math.random() > 0.5 ? 1 : -1; }
        if (Math.random() < 0.1) { y += Math.random() > 0.5 ? 1 : -1; }
      }
    }
  }

  _placeContent(contentKey, count) {
    for (let i = 0; i < count; i++) {
      let attempts = 0;
      while (attempts < 50) {
        const x = 1 + Math.floor(Math.random() * (this.width - 2));
        const y = 1 + Math.floor(Math.random() * (this.height - 2));
        const t = this.grid[y][x];
        if (t.content === "none" && HEX_TERRAIN[t.terrain].passable) {
          t.content = contentKey;
          if (contentKey === "enemy") {
            const tier = this.playerLv <= 10 ? "low" : (this.playerLv <= 25 ? "mid" : "high");
            const pool = HEX_ENEMY_POOLS[tier];
            t.enemyId = pool[Math.floor(Math.random() * pool.length)];
          }
          break;
        }
        attempts++;
      }
    }
  }

  _placeExit() {
    // 出口放在离玩家较远的边缘
    const edges = [];
    for (let x = 0; x < this.width; x++) {
      edges.push({x, y: 0}); edges.push({x, y: this.height - 1});
    }
    for (let y = 1; y < this.height - 1; y++) {
      edges.push({x: 0, y}); edges.push({x: this.width - 1, y});
    }
    // 过滤掉离玩家太近的
    const farEdges = edges.filter(e => {
      const dist = Math.sqrt((e.x - this.playerX)**2 + (e.y - this.playerY)**2);
      return dist > 20;
    });
    if (farEdges.length > 0) {
      const exit = farEdges[Math.floor(Math.random() * farEdges.length)];
      this.exitX = exit.x;
      this.exitY = exit.y;
      this.grid[this.exitY][this.exitX].terrain = "plains";
      this.grid[this.exitY][this.exitX].content = "none";
    } else {
      this.exitX = this.width - 1;
      this.exitY = this.height - 1;
    }
  }

  _clearStartArea() {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const x = this.playerX + dx, y = this.playerY + dy;
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.grid[y][x].content = "none";
          this.grid[y][x].enemyId = null;
          if (HEX_TERRAIN[this.grid[y][x].terrain] && !HEX_TERRAIN[this.grid[y][x].terrain].passable) {
            this.grid[y][x].terrain = "plains";
          }
        }
      }
    }
  }

  _exploreAround(cx, cy, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          this.explored[y][x] = true;
        }
      }
    }
  }

  // 尝试移动到指定方向 (dx, dy in axial-like offset coords)
  movePlayer(dx, dy) {
    const nx = this.playerX + dx;
    const ny = this.playerY + dy;

    if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) {
      return { moved: false, reason: "地图边界" };
    }

    const tile = this.grid[ny][nx];
    const terrain = HEX_TERRAIN[tile.terrain];
    if (!terrain.passable) {
      return { moved: false, reason: terrain.name + "阻挡了去路" };
    }

    this.playerX = nx;
    this.playerY = ny;
    this.steps++;
    this._exploreAround(nx, ny, 2);

    // 消耗游戏时间
    const timeCost = Math.floor(terrain.moveCost * 30); // 每个移动花费30分钟 * 地形系数
    this.totalTime += timeCost;

    // 检查是否到达出口
    if (nx === this.exitX && ny === this.exitY) {
      return { moved: true, arrived: true, tile, terrain, timeCost };
    }

    // 检查内容物
    if (tile.content !== "none") {
      const content = HEX_CONTENT[tile.content];
      const result = { moved: true, arrived: false, tile, terrain, content, timeCost };
      // 清除内容物（避免重复触发）
      tile.content = "none";
      tile.enemyId = null;
      return result;
    }

    return { moved: true, arrived: false, tile, terrain, timeCost };
  }

  // 获取当前可见范围（用于渲染）
  getVisibleArea(radius) {
    const tiles = [];
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = this.playerX + dx;
        const y = this.playerY + dy;
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
          if (this.explored[y][x]) {
            tiles.push({
              x, y,
              terrain: this.grid[y][x].terrain,
              content: this.grid[y][x].content,
              isPlayer: (x === this.playerX && y === this.playerY),
              isExit: (x === this.exitX && y === this.exitY),
            });
          }
        }
      }
    }
    return tiles;
  }
}

// 辅助：获取指定等级的敌人pool
function getHexEnemyPool(playerLv) {
  if (playerLv <= 10) return HEX_ENEMY_POOLS.low;
  if (playerLv <= 25) return HEX_ENEMY_POOLS.mid;
  return HEX_ENEMY_POOLS.high;
}
