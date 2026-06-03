// ===== 512×512 程序化废土世界生成器 =====

// 地形常量
const TILE = {
  OCEAN: 0, DEEP_OCEAN: 1, GRASSLAND: 2, FOREST: 3,
  DESERT: 4, MOUNTAIN: 5, SWAMP: 6, RIVER: 7, COAST: 8
};
const TILE_COLORS = {
  [TILE.OCEAN]: "#1a3a6a", [TILE.DEEP_OCEAN]: "#0a2050",
  [TILE.GRASSLAND]: "#4a6a2a", [TILE.FOREST]: "#1a4a10",
  [TILE.DESERT]: "#8a7a4a", [TILE.MOUNTAIN]: "#5a5a5a",
  [TILE.SWAMP]: "#2a4a3a", [TILE.RIVER]: "#2a5a8a", [TILE.COAST]: "#6a8a5a"
};
const TILE_NAMES = {
  [TILE.OCEAN]: "海洋", [TILE.DEEP_OCEAN]: "深海",
  [TILE.GRASSLAND]: "草地", [TILE.FOREST]: "森林",
  [TILE.DESERT]: "沙漠", [TILE.MOUNTAIN]: "山脉",
  [TILE.SWAMP]: "沼泽", [TILE.RIVER]: "河流", [TILE.COAST]: "海岸"
};
const TILE_PASSABLE = {
  [TILE.OCEAN]: false, [TILE.DEEP_OCEAN]: false,
  [TILE.GRASSLAND]: true, [TILE.FOREST]: true,
  [TILE.DESERT]: true, [TILE.MOUNTAIN]: false,
  [TILE.SWAMP]: true, [TILE.RIVER]: false, [TILE.COAST]: true
};

// ===== 噪声函数 =====
class SimpleNoise {
  constructor(seed) {
    this.seed = seed || 42;
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) this.perm[i] = i;
    // Fisher-Yates shuffle with seed
    let s = this.seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807 + 0) % 2147483647;
      const j = s % (i + 1);
      [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
    }
    for (let i = 0; i < 256; i++) this.perm[i + 256] = this.perm[i];
  }

  _fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  _lerp(a, b, t) { return a + t * (b - a); }
  _grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this._fade(xf);
    const v = this._fade(yf);
    const p = this.perm;
    const aa = p[p[X] + Y], ab = p[p[X] + Y + 1];
    const ba = p[p[X + 1] + Y], bb = p[p[X + 1] + Y + 1];
    return this._lerp(
      this._lerp(this._grad(p[aa], xf, yf), this._grad(p[ba], xf - 1, yf), u),
      this._lerp(this._grad(p[ab], xf, yf - 1), this._grad(p[bb], xf - 1, yf - 1), u),
      v
    );
  }

  // 多八度分形噪声 (0~1)
  fbm(x, y, octaves, lacunarity, gain) {
    let value = 0, amplitude = 1, frequency = 1, maxValue = 0;
    for (let i = 0; i < octaves; i++) {
      value += amplitude * this.noise2D(x * frequency, y * frequency);
      maxValue += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }
    return (value / maxValue + 1) / 2; // 归一化到 0~1
  }
}

// ===== 随机名称生成器 =====
const NAME_PREFIX = [
  "铁", "钢", "灰", "暗", "焰", "霜", "风", "雷", "影", "光",
  "荒", "废", "碎", "裂", "锈", "烬", "骨", "血", "魂", "灵",
  "深", "高", "远", "孤", "寂", "寒", "炎", "晶", "雾", "沙",
  "龙", "狼", "鹰", "蛇", "熊", "鸦", "蛛", "蝎", "鹤", "虎",
  "黑", "白", "红", "绿", "紫", "金", "银", "铜", "蓝", "翠",
  "古", "旧", "新", "永", "破", "亡", "毒", "酸", "烈", "静",
];
const NAME_SUFFIX_CITY = [
  "城", "堡", "都", "港", "关", "塞", "垒", "驿", "塔", "庭",
  "京", "州", "镇", "营", "殿", "谷", "崖", "壁", "岭", "川",
];
const NAME_SUFFIX_VILLAGE = [
  "村", "庄", "屯", "寨", "集", "甸", "坪", "沟", "湾", "坡",
];
const NAME_SUFFIX_OUTPOST = [
  "哨", "站", "所", "据点", "前哨", "营地", "避难所", "地堡", "瞭望塔", "要塞",
];
const NAME_SUFFIX_CAVE = [
  "洞", "窟", "穴", "坑", "深渊", "矿坑", "墓穴", "密室", "暗窟", "地宫",
];

function randomName(rng, type) {
  const prefix = NAME_PREFIX[Math.floor(rng() * NAME_PREFIX.length)];
  let suffixPool;
  switch (type) {
    case "city": suffixPool = NAME_SUFFIX_CITY; break;
    case "village": suffixPool = NAME_SUFFIX_VILLAGE; break;
    case "outpost": suffixPool = NAME_SUFFIX_OUTPOST; break;
    case "cave": suffixPool = NAME_SUFFIX_CAVE; break;
    default: suffixPool = NAME_SUFFIX_VILLAGE;
  }
  const suffix = suffixPool[Math.floor(rng() * suffixPool.length)];
  // 有时加形容词
  if (rng() < 0.25) {
    const adj = NAME_PREFIX[Math.floor(rng() * NAME_PREFIX.length)];
    return adj + prefix + suffix;
  }
  return prefix + suffix;
}

function randomDesc(rng, type, size) {
  const cityDescs = [
    "高墙环绕的幸存者聚居地，城内秩序井然。",
    "废土中繁荣的贸易枢纽，商队络绎不绝。",
    "坚固的军事要塞，守卫森严。",
    "古老的废墟上重建的城市，保留着战前科技。",
    "辐射区边缘的避难所，居民警惕而坚韧。",
    "依山而建的堡垒城市，易守难攻。",
    "河流交汇处的港口城市，渔业和贸易兴盛。",
    "地下避难所扩建而成的地下城。",
  ];
  const villageDescs = [
    "宁静的小村庄，居民以农耕和采集为生。",
    "猎人和采集者组成的小型聚落。",
    "逃难者建立的临时定居点。",
    "围绕一口古井建立的农耕村落。",
    "变异森林边缘的伐木者营地。",
  ];
  const outpostDescs = [
    "荒野中的前哨站，冒险者的补给点。",
    "废弃的军事哨所，现在用于监视变异生物。",
    "沙漠商路上的重要补给站。",
    "建立在废墟之上的侦查据点。",
  ];
  const caveDescs = [
    "深不见底的地下洞穴，据说隐藏着古老的秘密。",
    "变异生物巢穴，冒险者常来此清剿。",
    "战前军事设施的入口，内部结构复杂。",
    "天然形成的地下迷宫，矿藏丰富。",
    "被遗弃的矿井深处传来诡异的声响。",
  ];
  let pool;
  switch (type) {
    case "city": pool = cityDescs; break;
    case "village": pool = villageDescs; break;
    case "outpost": pool = outpostDescs; break;
    case "cave": pool = caveDescs; break;
    default: return "一处神秘的地点。";
  }
  return pool[Math.floor(rng() * pool.length)];
}

// ===== 世界生成器 =====
class WorldGenerator {
  constructor(seed) {
    this.seed = seed || Math.floor(Math.random() * 2147483647);
    this.width = 512;
    this.height = 512;
    this.tiles = new Uint8Array(this.width * this.height);
    this.explored = new Uint8Array(this.width * this.height);
    this.locations = [];
    this._rngState = this.seed;
  }

  _rng() {
    this._rngState = (this._rngState * 16807 + 0) % 2147483647;
    return (this._rngState - 1) / 2147483646;
  }

  _tileIndex(x, y) { return y * this.width + x; }
  _getTile(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return TILE.OCEAN;
    return this.tiles[this._tileIndex(x, y)];
  }
  _setTile(x, y, val) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.tiles[this._tileIndex(x, y)] = val;
    }
  }

  generate() {
    // 存储种子以便存档
    this._seed = this.seed;

    const heightNoise = new SimpleNoise(this.seed);
    const moistureNoise = new SimpleNoise(this.seed + 12345);

    // 1. 生成高度图和湿度图
    const heightMap = new Float32Array(this.width * this.height);
    const moistMap = new Float32Array(this.width * this.height);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const nx = x / this.width * 8;
        const ny = y / this.height * 8;
        heightMap[this._tileIndex(x, y)] = heightNoise.fbm(nx, ny, 4, 2.0, 0.5);
        moistMap[this._tileIndex(x, y)] = moistureNoise.fbm(nx + 3, ny + 7, 3, 2.0, 0.5);
      }
    }

    // 2. 高度图 → 地形
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const h = heightMap[this._tileIndex(x, y)];
        const m = moistMap[this._tileIndex(x, y)];
        let tile;

        if (h < 0.3) {
          tile = h < 0.15 ? TILE.DEEP_OCEAN : TILE.OCEAN;
        } else if (h < 0.35) {
          tile = TILE.COAST;
        } else if (h < 0.45 && m < 0.3) {
          tile = TILE.DESERT;
        } else if (h < 0.45 && m > 0.7) {
          tile = TILE.SWAMP;
        } else if (h < 0.6 && m > 0.45) {
          tile = TILE.FOREST;
        } else if (h < 0.7) {
          tile = TILE.GRASSLAND;
        } else {
          tile = TILE.MOUNTAIN;
        }

        this._setTile(x, y, tile);
      }
    }

    // 3. 平滑（消除散点）
    this._smooth(2);

    // 4. 生成河流
    this._generateRivers(heightMap, 30);

    // 5. 放置地点
    this._placeLocations(heightMap);

    return {
      tiles: this.tiles,
      explored: this.explored,
      locations: this.locations,
      width: this.width,
      height: this.height,
      _seed: this._seed,
    };
  }

  _smooth(passes) {
    const copy = new Uint8Array(this.tiles);
    for (let p = 0; p < passes; p++) {
      for (let y = 1; y < this.height - 1; y++) {
        for (let x = 1; x < this.width - 1; x++) {
          const counts = {};
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const t = copy[this._tileIndex(x + dx, y + dy)];
              counts[t] = (counts[t] || 0) + 1;
            }
          }
          let best = TILE.GRASSLAND, bestCount = 0;
          for (const [t, c] of Object.entries(counts)) {
            if (c > bestCount) { best = parseInt(t); bestCount = c; }
          }
          this._setTile(x, y, best);
        }
      }
      copy.set(this.tiles);
    }
  }

  _generateRivers(heightMap, count) {
    for (let i = 0; i < count; i++) {
      // 从高地随机起点开始
      let x, y, attempts = 0;
      do {
        x = 50 + Math.floor(this._rng() * (this.width - 100));
        y = 50 + Math.floor(this._rng() * (this.height - 100));
        attempts++;
      } while (attempts < 100 && this._getTile(x, y) !== TILE.MOUNTAIN && this._getTile(x, y) !== TILE.FOREST && heightMap[this._tileIndex(x, y)] < 0.6);

      if (attempts >= 100) continue;

      const maxLen = 40 + Math.floor(this._rng() * 80);
      for (let step = 0; step < maxLen; step++) {
        this._setTile(x, y, TILE.RIVER);
        // 相邻8格最低高度
        let bestDx = 0, bestDy = 0, bestH = heightMap[this._tileIndex(x, y)];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) continue;
            const h = heightMap[this._tileIndex(nx, ny)];
            if (h < bestH) { bestH = h; bestDx = dx; bestDy = dy; }
          }
        }
        if (bestDx === 0 && bestDy === 0) break; // 局部最低点
        x += bestDx;
        y += bestDy;
        // 到达海洋则停止
        const t = this._getTile(x, y);
        if (t === TILE.OCEAN || t === TILE.DEEP_OCEAN) {
          this._setTile(x, y, TILE.RIVER); // 入海口
          break;
        }
      }
    }
  }

  _placeLocations(heightMap) {
    this.locations = [];
    const rng = () => this._rng();

    // 辅助：某位置是否适合建城
    const isGoodCitySpot = (x, y) => {
      if (x < 3 || x >= this.width - 3 || y < 3 || y >= this.height - 3) return false;
      const t = this._getTile(x, y);
      if (t !== TILE.GRASSLAND && t !== TILE.FOREST && t !== TILE.COAST) return false;
      // 靠近河流或海岸加分
      let nearWater = false;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const nt = this._getTile(x + dx, y + dy);
          if (nt === TILE.RIVER || nt === TILE.OCEAN || nt === TILE.COAST) nearWater = true;
        }
      }
      return nearWater;
    };

    // 检查最小间距
    const tooClose = (x, y, minDist) => {
      for (const loc of this.locations) {
        const d = Math.sqrt((loc.x - x) ** 2 + (loc.y - y) ** 2);
        if (d < minDist) return true;
      }
      return false;
    };

    // 放置城市 (15-20个)
    const cityCount = 15 + Math.floor(rng() * 6);
    let placed = 0, attempts = 0;
    while (placed < cityCount && attempts < 5000) {
      const x = 5 + Math.floor(rng() * (this.width - 10));
      const y = 5 + Math.floor(rng() * (this.height - 10));
      if (isGoodCitySpot(x, y) && !tooClose(x, y, 30)) {
        const size = 1 + Math.floor(rng() * 5); // 1-5
        this.locations.push({
          id: "city_" + placed, name: randomName(rng, "city"),
          type: "city", x, y, size,
          desc: randomDesc(rng, "city", size),
          icon: "🏙️"
        });
        placed++;
      }
      attempts++;
    }

    // 放置村庄 (30-50个)
    const villageCount = 30 + Math.floor(rng() * 21);
    placed = 0; attempts = 0;
    while (placed < villageCount && attempts < 8000) {
      const x = 3 + Math.floor(rng() * (this.width - 6));
      const y = 3 + Math.floor(rng() * (this.height - 6));
      const t = this._getTile(x, y);
      if ((t === TILE.GRASSLAND || t === TILE.FOREST || t === TILE.COAST) && !tooClose(x, y, 10)) {
        this.locations.push({
          id: "village_" + placed, name: randomName(rng, "village"),
          type: "village", x, y, size: 1,
          desc: randomDesc(rng, "village", 1),
          icon: "🏘️"
        });
        placed++;
      }
      attempts++;
    }

    // 放置据点 (15-20个)
    const outpostCount = 15 + Math.floor(rng() * 6);
    placed = 0; attempts = 0;
    while (placed < outpostCount && attempts < 5000) {
      const x = 5 + Math.floor(rng() * (this.width - 10));
      const y = 5 + Math.floor(rng() * (this.height - 10));
      const t = this._getTile(x, y);
      if ((t === TILE.DESERT || t === TILE.SWAMP || t === TILE.MOUNTAIN || t === TILE.GRASSLAND) && !tooClose(x, y, 15)) {
        this.locations.push({
          id: "outpost_" + placed, name: randomName(rng, "outpost"),
          type: "outpost", x, y, size: 1,
          desc: randomDesc(rng, "outpost", 1),
          icon: "🏕️"
        });
        placed++;
      }
      attempts++;
    }

    // 放置洞穴/副本 (20-30个)
    const caveCount = 20 + Math.floor(rng() * 11);
    placed = 0; attempts = 0;
    while (placed < caveCount && attempts < 6000) {
      const x = 3 + Math.floor(rng() * (this.width - 6));
      const y = 3 + Math.floor(rng() * (this.height - 6));
      const t = this._getTile(x, y);
      if ((t === TILE.MOUNTAIN || t === TILE.FOREST || t === TILE.SWAMP || t === TILE.DESERT) && !tooClose(x, y, 8)) {
        this.locations.push({
          id: "cave_" + placed, name: randomName(rng, "cave"),
          type: "dungeon", x, y, size: 1,
          desc: randomDesc(rng, "cave", 1),
          icon: "🏚️"
        });
        placed++;
      }
      attempts++;
    }

    // 确保玩家起始点附近安全（清除周围3格内地点）
    const startX = Math.floor(this.width / 2);
    const startY = Math.floor(this.height / 2);
    this.locations = this.locations.filter(loc => {
      const d = Math.sqrt((loc.x - startX) ** 2 + (loc.y - startY) ** 2);
      return d > 8;
    });

    // 在起始点放一个村庄（玩家的初始据点）
    this.locations.push({
      id: "village_start", name: randomName(rng, "village"),
      type: "village", x: startX + 1, y: startY + 2, size: 1,
      desc: "你从废墟中醒来后发现的第一个人类聚落。",
      icon: "🏘️"
    });

    // 确保起始点是可通行的
    for (let dy = -3; dy <= 3; dy++) {
      for (let dx = -3; dx <= 3; dx++) {
        const t = this._getTile(startX + dx, startY + dy);
        if (t === TILE.OCEAN || t === TILE.DEEP_OCEAN || t === TILE.MOUNTAIN) {
          this._setTile(startX + dx, startY + dy, TILE.GRASSLAND);
        }
      }
    }
    // 探索起始区域
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const idx = this._tileIndex(startX + dx, startY + dy);
        if (idx >= 0 && idx < this.width * this.height) {
          this.explored[idx] = 1;
        }
      }
    }
  }
}

// 全局世界数据实例（游戏初始化时设置）
let WORLD_DATA = null;

function initWorld(seed) {
  const gen = new WorldGenerator(seed);
  WORLD_DATA = gen.generate();
  return WORLD_DATA;
}
