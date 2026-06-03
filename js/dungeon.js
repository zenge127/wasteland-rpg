// ===== 随机副本迷宫生成系统 =====

class DungeonGenerator {
  constructor(playerLv) {
    this.playerLv = playerLv;
    this.width = 0;
    this.height = 0;
    this.grid = [];      // 2D数组: 0=墙 1=路 2=入口 3=出口 4=宝箱 5=敌人 6=已探索
    this.playerPos = { x: 0, y: 0 };
    this.exitPos = { x: 0, y: 0 };
    this.name = "";
    this.theme = "";
    this.lv = 0;
    this.explored = [];
    this.rooms = [];
    this.chests = [];
    this.enemies = [];
  }

  generate() {
    // 根据等级决定大小和难度
    this.lv = Math.max(1, this.playerLv + Math.floor(Math.random() * 6) - 3);
    const size = 15 + Math.floor(this.lv / 5);
    this.width = Math.min(40, size);
    this.height = Math.min(30, size);

    // 随机主题
    const themes = [
      { name: "辐射废墟", desc: "核爆炸后的城市废墟，残垣断壁中隐藏着变异生物。" },
      { name: "地下避难所", desc: "末日前的避难所，如今已被变异体占据。" },
      { name: "古代墓穴", desc: "被遗忘的地下墓穴，古老的陷阱和宝藏并存。" },
      { name: "废弃工厂", desc: "战前的自动化工厂，机器人仍在执行最后的指令。" },
      { name: "变异巢穴", desc: "变异生物的巢穴，到处是恶心的生物质。" },
      { name: "军事基地", desc: "旧时代的军事设施，高墙之后是强大的防御系统。" },
      { name: "海底遗迹", desc: "沉入海底的古代文明遗迹，水压和未知生物是最大威胁。" },
      { name: "空间裂隙", desc: "时空扭曲形成的异常区域，现实规则在这里失效。" },
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    this.name = theme.name;
    this.theme = theme.desc;

    // 初始化全墙
    this.grid = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
    this.explored = Array(this.height).fill(null).map(() => Array(this.width).fill(false));

    // 生成房间
    this.generateRooms();

    // 放置入口和出口
    this.placeEntranceAndExit();

    // 放置宝箱
    this.placeChests();

    // 放置敌人
    this.placeEnemies();

    // 标记入口为已探索
    this.explored[this.playerPos.y][this.playerPos.x] = true;

    return this.getInfo();
  }

  generateRooms() {
    const roomCount = 5 + Math.floor(this.width * this.height / 50);
    const minRoomSize = 3;
    const maxRoomSize = 6;

    for (let attempt = 0; attempt < roomCount * 3 && this.rooms.length < roomCount; attempt++) {
      const rw = minRoomSize + Math.floor(Math.random() * (maxRoomSize - minRoomSize));
      const rh = minRoomSize + Math.floor(Math.random() * (maxRoomSize - minRoomSize));
      const rx = 1 + Math.floor(Math.random() * (this.width - rw - 2));
      const ry = 1 + Math.floor(Math.random() * (this.height - rh - 2));

      // 检查是否与其他房间重叠
      let overlap = false;
      for (const room of this.rooms) {
        if (rx < room.x + room.w + 1 && rx + rw + 1 > room.x &&
            ry < room.y + room.h + 1 && ry + rh + 1 > room.y) {
          overlap = true;
          break;
        }
      }
      if (overlap) continue;

      // 画房间
      for (let y = ry; y < ry + rh; y++) {
        for (let x = rx; x < rx + rw; x++) {
          if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            this.grid[y][x] = 1;
          }
        }
      }
      this.rooms.push({ x: rx, y: ry, w: rw, h: rh, cx: Math.floor(rx + rw / 2), cy: Math.floor(ry + rh / 2) });
    }

    // 连接房间 (走廊)
    for (let i = 1; i < this.rooms.length; i++) {
      const prev = this.rooms[i - 1];
      const curr = this.rooms[i];
      this.createCorridor(prev.cx, prev.cy, curr.cx, curr.cy);
    }
  }

  createCorridor(x1, y1, x2, y2) {
    // L形走廊
    if (Math.random() < 0.5) {
      this.hCorridor(Math.min(x1, x2), Math.max(x1, x2), y1);
      this.vCorridor(Math.min(y1, y2), Math.max(y1, y2), x2);
    } else {
      this.vCorridor(Math.min(y1, y2), Math.max(y1, y2), x1);
      this.hCorridor(Math.min(x1, x2), Math.max(x1, x2), y2);
    }
  }

  hCorridor(x1, x2, y) {
    for (let x = x1; x <= x2; x++) {
      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        if (this.grid[y][x] === 0) this.grid[y][x] = 1;
      }
    }
  }

  vCorridor(y1, y2, x) {
    for (let y = y1; y <= y2; y++) {
      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        if (this.grid[y][x] === 0) this.grid[y][x] = 1;
      }
    }
  }

  placeEntranceAndExit() {
    if (this.rooms.length === 0) return;
    // 入口在第一个房间
    const entrance = this.rooms[0];
    this.playerPos = { x: entrance.cx, y: entrance.cy };
    this.grid[entrance.cy][entrance.cx] = 2;

    // 出口在最远的房间
    const exit = this.rooms[this.rooms.length - 1];
    this.exitPos = { x: exit.cx, y: exit.cy };
    this.grid[exit.cy][exit.cx] = 3;
  }

  placeChests() {
    const chestCount = 2 + Math.floor(this.rooms.length / 3);
    for (let i = 0; i < chestCount; i++) {
      const pos = this.findRandomFloor();
      if (pos) {
        this.grid[pos.y][pos.x] = 4;
        this.chests.push({
          x: pos.x, y: pos.y,
          loot: this.generateChestLoot(),
          opened: false,
        });
      }
    }
  }

  placeEnemies() {
    const enemyCount = 3 + Math.floor(this.rooms.length / 2);
    for (let i = 0; i < enemyCount; i++) {
      const pos = this.findRandomFloor();
      if (pos) {
        this.grid[pos.y][pos.x] = 5;
        const enemyPool = getEnemiesForLevel(this.lv);
        const template = enemyPool[Math.floor(Math.random() * enemyPool.length)];
        this.enemies.push({
          x: pos.x, y: pos.y,
          enemy: spawnEnemy(template),
          defeated: false,
        });
      }
    }
  }

  findRandomFloor() {
    const floorTiles = [];
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        if (this.grid[y][x] === 1) floorTiles.push({ x, y });
      }
    }
    if (floorTiles.length === 0) return null;
    return floorTiles[Math.floor(Math.random() * floorTiles.length)];
  }

  generateChestLoot() {
    const loot = [];
    const quality = randomQuality(this.lv);

    // 金币
    loot.push({ type: "gold", amount: 50 + Math.floor(Math.random() * this.lv * 30) });

    // 药水
    if (Math.random() < 0.6) {
      const potions = ["health_potion_s", "health_potion_m", "mana_potion_s", "mana_potion_m", "bandage"];
      const pid = potions[Math.floor(Math.random() * potions.length)];
      loot.push({ type: "item", item: ALL_ITEMS[pid] });
    }

    // 装备
    if (Math.random() < 0.4) {
      const equipPool = [...Object.values(WEAPON_BASE), ...Object.values(ARMOR_BASE)]
        .filter(e => Math.abs(e.minLv - this.playerLv) <= 5);
      if (equipPool.length > 0) {
        const base = equipPool[Math.floor(Math.random() * equipPool.length)];
        const eq = generateEquipItem(base, quality, this.playerLv);
        if (eq) loot.push({ type: "equip", item: eq });
      }
    }

    // 技能卷轴
    if (Math.random() < 0.15) {
      const scrolls = ["skill_scroll_common", "skill_scroll_rare", "skill_scroll_epic"];
      const sid = scrolls[Math.min(qualityIndex(quality), 2)];
      loot.push({ type: "item", item: ALL_ITEMS[sid] });
    }

    // 材料
    if (Math.random() < 0.5) {
      const mats = ["scrap_metal", "steel_ingot", "circuit_board", "magic_crystal", "mutant_gland"];
      const mid = mats[Math.floor(Math.random() * mats.length)];
      loot.push({ type: "item", item: ALL_ITEMS[mid], qty: Math.floor(Math.random() * 3) + 1 });
    }

    return loot;
  }

  movePlayer(dx, dy) {
    const nx = this.playerPos.x + dx;
    const ny = this.playerPos.y + dy;
    if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.height) return { moved: false, reason: "边界" };
    if (this.grid[ny][nx] === 0) return { moved: false, reason: "墙壁" };

    this.playerPos = { x: nx, y: ny };
    this.explored[ny][nx] = true;

    const tile = this.grid[ny][nx];
    if (tile === 3) return { moved: true, reachedExit: true }; // 到达出口
    if (tile === 4) return { moved: true, foundChest: this.getChestAt(nx, ny) };
    if (tile === 5) return { moved: true, foundEnemy: this.getEnemyAt(nx, ny) };

    return { moved: true };
  }

  getChestAt(x, y) {
    return this.chests.find(c => c.x === x && c.y === y && !c.opened);
  }

  getEnemyAt(x, y) {
    return this.enemies.find(e => e.x === x && e.y === y && !e.defeated);
  }

  openChest(chest) {
    chest.opened = true;
    this.grid[chest.y][chest.x] = 1;
    return chest.loot;
  }

  defeatEnemy(enemy) {
    enemy.defeated = true;
    this.grid[enemy.y][enemy.x] = 1;
  }

  getInfo() {
    return {
      name: this.name,
      theme: this.theme,
      lv: this.lv,
      width: this.width,
      height: this.height,
      grid: this.grid,
      explored: this.explored,
      playerPos: this.playerPos,
      exitPos: this.exitPos,
      rooms: this.rooms.length,
      enemies: this.enemies.filter(e => !e.defeated).length,
      chests: this.chests.filter(c => !c.opened).length,
    };
  }
}
