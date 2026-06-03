// ===== 游戏管理器 =====

class Game {
  constructor() {
    this.player = new Player("流浪者");
    this.combat = new CombatSystem(this.player);
    this.questManager = new QuestManager();

    // 地图初始化 (Leaflet)
    this.worldMap = new WorldMap("world-map", this.player);

    // UI初始化
    this.ui = new UIManager(this.player, this.combat, this.worldMap);

    // 当前副本
    this.currentDungeon = null;

    // 多次自动探索状态
    this.multiExplore = {
      active: false, totalRounds: 0, completedRounds: 0,
      totalExp: 0, totalGold: 0, allItems: [], wins: 0, losses: 0,
    };

    // 挂载全局引用
    window.gameInstance = this;
    window.questManager = this.questManager;
    window.playerInstance = this.player;
    window.combatInstance = this.combat;

    this.init();
  }

  init() {
    // 初始化世界数据（在创建地图前）
    if (!WORLD_DATA) {
      initWorld(Math.floor(Math.random() * 2147483647));
    }

    // 地图点击回调
    this.worldMap.onCityClick = (city) => this.onWorldClick(city);
    this.worldMap.onMapClick = (data) => this.onMapMove(data);

    // 战斗UI回调
    this.combat.onUpdate = (state) => {
      if (state.active) {
        this.ui.showCombat(state);
      } else {
        this.ui.hideCombat();
        this.ui.updateAll();
      }
    };

    this.combat.onBattleResult = (result) => {
      if (this.multiExplore.active) {
        // 多次探索统一追踪
        if (result.won) {
          this.multiExplore.totalExp += result.exp;
          this.multiExplore.totalGold += result.gold;
          this.multiExplore.allItems.push(...result.items);
          this.multiExplore.wins++;
        } else {
          this.multiExplore.losses++;
          this.multiExplore.active = false;
        }
        // 延迟调度下一步
        setTimeout(() => {
          if (this.multiExplore.active && !this.combat.active) {
            if (this.multiExplore.completedRounds >= this.multiExplore.totalRounds) {
              this.showMultiExploreResult();
            } else {
              setTimeout(() => this.doMultiExploreStep(), 500);
            }
          } else if (!this.multiExplore.active) {
            this.showMultiExploreResult();
          }
        }, 400);
        return;
      }
      setTimeout(() => this.ui.showBattleResult(result), 300);
    };

    this.combat.onWin = (result) => {
      this.player.addLog(`⚔️ 战斗胜利！获得 ${result.exp} 经验，${result.gold} 金币。`);
      advanceGameTime(30 + Math.floor(Math.random() * 30)); // 战斗耗时30-60分钟
      this.questManager.updateProgress("gold_earn", result.gold || 0);
      this.questManager.goldEarned += (result.gold || 0);
      this.questManager.checkCompletions();
      this.ui.updateAll();
      if (this.currentDungeon) this.onDungeonEnemyDefeated();
    };

    this.combat.onLose = () => {
      // 死亡惩罚
      const lostExp = Math.floor(this.player.freeExp * 0.1);
      this.player.freeExp -= lostExp;
      if (this.player.freeExp < 0) this.player.freeExp = 0;
      this.player.addLog(`💀 战斗失败！失去未分配经验 ${lostExp} 点。`);
      // 装备掉耐久
      let brokenItems = 0;
      for (const slot in this.player.equipment) {
        const eq = this.player.equipment[slot];
        if (eq && eq.durability !== undefined) {
          eq.durability -= Math.floor(eq.maxDurability * 0.1);
          if (eq.durability <= 0) {
            this.player.equipment[slot] = null;
            this.player.addLog(`💔 ${eq.name} 耐久耗尽，已损坏！`);
            brokenItems++;
          }
        }
      }
      if (brokenItems === 0) this.player.addLog("🔧 所有装备耐久度 -10%。");
      // 传送回世界中心
      const cx = Math.floor(WORLD_DATA.width / 2);
      const cy = Math.floor(WORLD_DATA.height / 2);
      this.player.position.x = cx;
      this.player.position.y = cy;
      this.worldMap.centerOn(cx, cy, 2);
      this.player.addLog("🏠 重伤后回到了起始之地的避难所...");
      this.ui.updateAll();
    };

    this.combat.onQuestUpdate = (type, data) => {
      this.questManager.updateProgress(type, data);
      this.questManager.checkCompletions();
    };

    // 全局事件
    this.setupGlobalEvents();

    // 等级提升 → 更新任务进度
    this.player.onLevelUp = (newLv) => {
      this.questManager.updateProgress("level", newLv);
      this.questManager.checkCompletions();
      this.autoAcceptQuests(); // 检查是否有新主线可接
      this.ui.updateAll();
    };

    // 物品获得 → 更新收集任务进度
    this.player.onItemAdded = (itemId) => {
      this.questManager.updateProgress("collect", itemId);
      this.questManager.checkCompletions();
    };

    // 初始任务
    this.giveStarterItems();
    this.autoAcceptQuests();

    // 初始UI更新
    this.ui.updateAll();
    updateGameClock();

    this.player.addLog("废土历2187年，核战争后的第150年。");
    this.player.addLog("你从废墟中醒来，身边只有一些基本物资。");
    this.player.addLog("点击地图探索废土世界，或使用方向键/WASD移动。");
    this.player.addLog("💡 游戏时间仅在移动、探索和完成任务时流逝。");
  }

  giveStarterItems() {
    // 基础装备
    this.player.addItem({ ...ALL_ITEMS["rusty_sword"], id: "rusty_sword" });
    this.player.addItem({ ...ALL_ITEMS["rag_armor"], id: "rag_armor" });
    this.player.addItem({ ...ALL_ITEMS["health_potion_s"], id: "health_potion_s" }, 2);
    this.player.addItem({ ...ALL_ITEMS["mana_potion_s"], id: "mana_potion_s" });
    this.player.addLog("📦 初始物资已放入背包，打开【装备】和【物品】面板查看。");
  }

  autoAcceptQuests() {
    // 检查所有主线任务，接受符合条件的
    for (const q of QUEST_TEMPLATES) {
      if (q.minLv <= this.player.lv && q.type === "main"
          && !this.questManager.deliveredQuests.includes(q.id)
          && !this.questManager.activeQuests.find(a => a.id === q.id)) {
        this.questManager.acceptQuest(q);
      }
    }
  }

  setupGlobalEvents() {
    // 窗口大小变化
    window.addEventListener("resize", () => {
      this.worldMap.resize();
    });

    // 按键快捷键
    window.addEventListener("keydown", (e) => {
      if (this.combat.active) {
        this.handleCombatKey(e);
      } else if (this.currentDungeon) {
        this.handleDungeonKey(e);
      } else {
        this.handleWorldKey(e);
      }
    });

    // 暴露全局函数给onclick
    this.exposeGlobals();
  }

  exposeGlobals() {
    // 装备物品
    window.sortInventory = (mode) => { this.ui.sortInventory(mode); };

    window.equipItemById = (id) => {
      const item = this.player.inventory.find(i => i.id === id);
      if (item) {
        if (this.player.equipItem(item)) {
          this.ui.updateAll();
        }
      }
    };

    // 卸下装备
    window.unequipSlot = (slot) => {
      if (this.player.unequipSlot(slot)) {
        this.ui.updateAll();
      }
    };

    // 使用物品
    window.useItemById = (id) => {
      const item = this.player.inventory.find(i => i.id === id);
      if (!item) return;
      if (item.type === "consumable" && this.combat.active) {
        this.combat.playerUseItem(id);
      } else if (item.type === "consumable") {
        // 非战斗中不能使用消耗品
        this.player.addLog("⚠️ 战斗中才能使用药水类道具。");
      } else if (item.type === "stat_potion" || item.type === "skill_book" || item.type === "scroll") {
        this.player.useItem(id);
      }
      this.ui.updateAll();
    };

    // 出售物品
    window.sellItemById = (id) => {
      const item = this.player.inventory.find(i => i.id === id);
      if (item) {
        const isStack = this.player._isStackable(item) && (item.qty || 1) > 1;
        const qty = isStack ? 1 : (this.player._isStackable(item) ? (item.qty || 1) : 1);
        const sellPrice = (item.sellPrice || 1) * qty;
        this.player.gold += sellPrice;
        this.player.removeItem(id, qty);
        this.player.addLog(`💰 出售了 ${item.name}${qty > 1 ? ' x' + qty : ''}，获得 ${sellPrice} 金币。`);
        this.ui.updateAll();
      }
    };

    window.sellItemAllById = (id) => {
      const item = this.player.inventory.find(i => i.id === id);
      if (item) {
        const qty = this.player._isStackable(item) ? (item.qty || 1) : 1;
        const sellPrice = (item.sellPrice || 1) * qty;
        this.player.gold += sellPrice;
        this.player.removeItem(id, qty);
        this.player.addLog(`💰 出售了 ${item.name}${qty > 1 ? ' x' + qty : ''}，获得 ${sellPrice} 金币。`);
        this.ui.updateAll();
      }
    };

    // 分离堆叠物品
    window.splitInventoryStack = (id) => {
      const amt = prompt("请输入要分离的数量：");
      if (!amt) return;
      const qty = parseInt(amt);
      if (isNaN(qty) || qty <= 0) return;
      if (this.player.splitStack(id, qty)) {
        this.player.addLog(`📦 分离了 ${qty} 个物品到新格子。`);
        this.ui.updateAll();
      } else if (qty >= (this.player.inventory.find(i => i.id === id)?.qty || 0)) {
        alert("分离数量必须小于当前堆叠数量。");
      }
    };

    // 经验分配
    window.allocateExp = (type) => {
      const amtEl = document.getElementById("ea-amount");
      let amount = amtEl ? parseInt(amtEl.value) || 0 : 0;
      if (amount <= 0) return;
      amount = Math.min(amount, this.player.freeExp);
      if (type === "character") {
        this.player.allocateExpToLevel(amount);
      } else if (type === "skill") {
        const sel = document.getElementById("ea-skill-select");
        if (sel && sel.value) {
          this.player.allocateExpToSkill(sel.value, amount);
        }
      }
      // 更新输入框上限
      if (amtEl) { amtEl.max = this.player.freeExp; if (parseInt(amtEl.value) > this.player.freeExp) amtEl.value = this.player.freeExp; }
      this.ui.updateAll();
    };
    window.setAllExp = () => {
      const amtEl = document.getElementById("ea-amount");
      if (amtEl) { amtEl.value = this.player.freeExp; amtEl.max = this.player.freeExp; }
    };

    // 属性分配
    window.allocateStatPoint = (stat) => {
      if (this.player.allocateStatPoint(stat)) {
        this.ui.updateAll();
      }
    };

    // 战斗函数
    window.combatAttack = () => this.combat.playerAttack();
    window.combatDefend = () => this.combat.playerDefend();
    window.combatFlee = () => this.combat.playerFlee();
    window.combatItem = () => this.ui.showCombatItems();
    window.toggleAutoCombat = () => this.combat.toggleAuto();

    document.getElementById("combat-skills-btn").addEventListener("click", () => {
      this.ui.showCombatSkills();
    });

    // 城市函数
    window.leaveCity = () => this.leaveCity();
    window.cityShop = () => this.openShop();
    window.cityTrainer = () => this.openTrainer();
    window.cityInn = () => this.cityInnRest();
    window.cityBlacksmith = () => this.openBlacksmith();
    window.cityQuestBoard = () => this.openQuestBoard();
    window.cityStorage = () => this.ui.openStorage();
    window.storageSetFilter = (key) => {
      this.ui._storageFilter = key;
      this.ui.renderStorage();
      const content = document.getElementById("storage-content");
      if (content) {
        content.innerHTML = document.getElementById("storage-render-target")?.innerHTML || "";
      }
    };
    window.storageDeposit = (itemId, qty) => {
      const result = this.player.depositToStorage(itemId, typeof qty === 'string' ? parseInt(qty) : qty);
      if (!result.success) this.player.addLog("❌ " + result.reason);
      this.ui.renderStorage();
      this.ui.openStorage();
      this.ui.updateAll();
    };
    window.storageWithdraw = (itemId, qty) => {
      const result = this.player.withdrawFromStorage(itemId, typeof qty === 'string' ? parseInt(qty) : qty);
      if (!result.success) this.player.addLog("❌ " + result.reason);
      this.ui.renderStorage();
      this.ui.openStorage();
      this.ui.updateAll();
    };
    window.closeModal = () => {
      document.getElementById("modal-overlay").style.display = "none";
    };

    // === 地图移动 ===
    window.enterNearCity = (name) => {
      // 由 WorldMap popup 调用，直接进入
      const nearby = this.worldMap.findNearbyCity(3);
      if (nearby) this.enterCity(nearby);
    };
    window.enterDungeonDirect = () => {
      this.enterDungeon();
    };

    // === 游戏内菜单 ===
    window.toggleGameMenu = () => {
      const overlay = document.getElementById("game-menu-overlay");
      if (overlay.style.display === "flex") {
        overlay.style.display = "none";
      } else {
        overlay.style.display = "flex";
      }
    };
    window.closeGameMenu = () => {
      document.getElementById("game-menu-overlay").style.display = "none";
    };
    window.returnToMainMenu = () => {
      window.closeGameMenu();
      const ss = document.getElementById("start-screen");
      if (ss) { ss.style.display = "flex"; ss.style.opacity = "1"; }
    };

    // === 开始界面 ===
    window.startNewGame = () => {
      const ss = document.getElementById("start-screen");
      if (ss) { ss.style.transition = "opacity 0.5s"; ss.style.opacity = "0"; }
      setTimeout(() => { if (ss) ss.style.display = "none"; }, 500);
      this.player.addLog("🌅 废土历2187年，核战争后的第150年...");
      this.player.addLog("你从废墟中醒来，踏上了废土的冒险之旅。");
      this.ui.updateAll();
    };

    // === 多槽位存档 ===
    window.showSaveSlots = () => {
      let html = `<h3>💾 保存游戏 - 选择槽位</h3><div style="display:flex;flex-direction:column;gap:6px;">`;
      for (let i = 1; i <= 5; i++) {
        const key = `wasteland_save_${i}`;
        const raw = localStorage.getItem(key);
        let info = '<span style="color:#5a5a4a;">空槽位</span>';
        if (raw) {
          try {
            const d = JSON.parse(raw);
            const d2 = new Date(d.timestamp);
            info = `Lv.${d.lv} | 💰${d.gold} | 📅${d2.toLocaleDateString()} ${d2.toLocaleTimeString()}`;
          } catch(e) { info = '<span style="color:#ff4040;">损坏</span>'; }
        }
        html += `<div style="background:#1a1008;padding:10px;border-radius:3px;display:flex;align-items:center;justify-content:space-between;">
          <div><b style="color:#c8b87d;">槽位 ${i}</b> <span style="font-size:11px;margin-left:8px;">${info}</span></div>
          <button class="btn-small" onclick="window.saveToSlot(${i})">💾 保存到此</button></div>`;
      }
      html += `</div>`;
      this.ui.showModal("保存游戏", html);
    };

    window.saveToSlot = (slot) => {
      const data = {
        slot, timestamp: Date.now(),
        lv: this.player.lv, exp: this.player.exp, freeExp: this.player.freeExp,
        expToNext: this.player.expToNext,
        baseStats: {...this.player.baseStats}, freeStatPoints: this.player.freeStatPoints,
        gold: this.player.gold, position: {...this.player.position},
        worldSeed: WORLD_DATA ? WORLD_DATA._seed || 0 : 0,
        hasBoat: this.player.hasBoat, boatType: this.player.boatType,
        mainSkillId: this.player.mainSkillId,
        learnedSkills: { active: this.player.learnedSkills.active, passive: this.player.learnedSkills.passive },
        skillExp: {...this.player.skillExp},
        inventory: this.player.inventory,
        equipment: this.player.equipment,
        storage: this.player.storage,
        gameDay: GAME_TIME.day, gameHour: GAME_TIME.hour, gameMinute: GAME_TIME.minute,
      };
      localStorage.setItem(`wasteland_save_${slot}`, JSON.stringify(data));
      this.player.addLog(`💾 游戏已保存到槽位 ${slot}。`);
      document.getElementById("modal-overlay").style.display = "none";
    };

    window.showLoadSlots = () => {
      let html = `<h3>📂 读取进度 - 选择槽位</h3><div style="display:flex;flex-direction:column;gap:6px;">`;
      let hasAny = false;
      for (let i = 1; i <= 5; i++) {
        const raw = localStorage.getItem(`wasteland_save_${i}`);
        if (raw) {
          hasAny = true;
          try {
            const d = JSON.parse(raw);
            const d2 = new Date(d.timestamp);
            html += `<div style="background:#1a1008;padding:10px;border-radius:3px;display:flex;align-items:center;justify-content:space-between;">
              <div><b style="color:#f0c040;">槽位 ${i}</b>
                <span style="font-size:12px;margin-left:8px;color:#c8b87d;">Lv.${d.lv} 💰${d.gold}</span>
                <span style="font-size:10px;color:#8a8a7a;margin-left:8px;">${d2.toLocaleString()}</span></div>
              <button class="btn-small" onclick="window.loadFromSlot(${i})">📂 读取</button>
              <button class="btn-small" style="color:#ff4040;" onclick="window.deleteSlot(${i});window.closeModal();setTimeout(()=>window.showLoadSlots(),100);">🗑</button></div>`;
          } catch(e) {}
        }
      }
      if (!hasAny) html += `<p style="color:#5a5a4a;">没有找到任何存档。</p>`;
      html += `</div>`;
      this.ui.showModal("读取进度", html);
    };

    window.loadFromSlot = (slot) => {
      const raw = localStorage.getItem(`wasteland_save_${slot}`);
      if (!raw) { alert("槽位为空。"); return; }
      try {
        const data = JSON.parse(raw);
        // 如果存档有世界种子，重新生成世界
        if (data.worldSeed && (!WORLD_DATA || WORLD_DATA._seed !== data.worldSeed)) {
          initWorld(data.worldSeed);
          this.worldMap.locations = WORLD_DATA.locations || [];
        }
        this.player.lv = data.lv || 1;
        this.player.exp = data.exp || 0;
        this.player.freeExp = data.freeExp || 0;
        this.player.expToNext = data.expToNext || this.player.calcExpToNext(this.player.lv + 1);
        this.player.baseStats = data.baseStats || this.player.baseStats;
        this.player.freeStatPoints = data.freeStatPoints || 0;
        this.player.gold = data.gold || 0;
        this.player.position = data.position || { x: Math.floor(WORLD_DATA.width/2), y: Math.floor(WORLD_DATA.height/2) };
        this.player.hasBoat = data.hasBoat || false;
        this.player.boatType = data.boatType || null;
        this.player.mainSkillId = data.mainSkillId || null;
        this.player.learnedSkills = data.learnedSkills || { active: [], passive: [] };
        this.player.skillExp = data.skillExp || {};
        this.player.inventory = data.inventory || [];
        this.player.equipment = data.equipment || this.player.equipment;
        this.player.storage = data.storage || [];
        if (data.gameDay !== undefined) { GAME_TIME.day = data.gameDay; GAME_TIME.hour = data.gameHour; GAME_TIME.minute = data.gameMinute; }
        this.worldMap.centerOn(this.player.position.x, this.player.position.y, 2);
        document.getElementById("modal-overlay").style.display = "none";
        window.startNewGame();
        this.player.addLog(`💾 从槽位 ${slot} 读取了进度。`);
        this.ui.updateAll();
      } catch(e) { alert("存档损坏，无法读取。"); }
    };

    window.deleteSlot = (slot) => {
      if (confirm(`确定删除槽位 ${slot} 的存档吗？此操作不可撤销。`)) {
        localStorage.removeItem(`wasteland_save_${slot}`);
        this.player.addLog(`🗑 槽位 ${slot} 的存档已删除。`);
      }
    };

    window.showGameGuide = () => {
      const guide = `
        <h3>📖 游戏知识</h3>
        <div style="font-size:13px;line-height:1.8;color:#c8b87d;">
          <p>🗺️ <b>探索</b>: 点击地图移动，方向键/WASD移动，滚轮缩放</p>
          <p>⚔️ <b>战斗</b>: 回合制，1攻击 2技能 3防御 4道具 5逃跑 A自动</p>
          <p>🏙️ <b>城市</b>: 靠近城市后点击进入，可购物/学习技能/接任务</p>
          <p>⛵ <b>海洋</b>: 需购买船只才能在海洋航行</p>
          <p>📚 <b>技能</b>: 在城市教官处学习，10级解锁第2槽，20级第3槽</p>
          <p>⭐ <b>经验</b>: 击杀敌人获得，手动分配给角色或技能等级</p>
          <p>💎 <b>品质</b>: <span style="color:#c0c0c0">普通</span>→<span style="color:#4080ff">精良</span>→<span style="color:#a040ff">优秀</span>→<span style="color:#ffc040">完美</span>→<span style="color:#ff8c00">传说</span>→<span style="color:#ff4040">神话</span></p>
          <p>🏚️ <b>副本</b>: 探索地下迷宫，击败敌人和BOSS获取稀有战利品</p>
        </div>`;
      this.ui.showModal("游戏知识", guide);
    };

    window.quitGame = () => {
      if (confirm("确定要离开废土世界吗？\n\n你的进度将自动保存到槽位1。")) {
        const data = {
          slot: 1, timestamp: Date.now(),
          lv: this.player.lv, exp: this.player.exp, freeExp: this.player.freeExp,
          expToNext: this.player.expToNext,
          baseStats: {...this.player.baseStats}, freeStatPoints: this.player.freeStatPoints,
          gold: this.player.gold, position: {...this.player.position},
          worldSeed: WORLD_DATA ? WORLD_DATA._seed || 0 : 0,
          hasBoat: this.player.hasBoat, boatType: this.player.boatType,
          mainSkillId: this.player.mainSkillId,
          learnedSkills: { active: this.player.learnedSkills.active, passive: this.player.learnedSkills.passive },
          skillExp: {...this.player.skillExp},
          inventory: this.player.inventory,
          equipment: this.player.equipment,
          storage: this.player.storage,
          gameDay: GAME_TIME.day, gameHour: GAME_TIME.hour, gameMinute: GAME_TIME.minute,
        };
        localStorage.setItem("wasteland_save_1", JSON.stringify(data));
        // NW.js 桌面环境用 nw.App.quit()，浏览器用 window.close()
        if (typeof nw !== 'undefined' && nw.App) {
          nw.App.quit();
        } else {
          window.close();
        }
      }
    };

    // 快捷存档 (Ctrl+S → 槽位1)
    window.saveGame = () => {
      const data = {
        slot: 1, timestamp: Date.now(),
        lv: this.player.lv, exp: this.player.exp, freeExp: this.player.freeExp,
        expToNext: this.player.expToNext,
        baseStats: {...this.player.baseStats}, freeStatPoints: this.player.freeStatPoints,
        gold: this.player.gold, position: {...this.player.position},
        worldSeed: WORLD_DATA ? WORLD_DATA._seed || 0 : 0,
        hasBoat: this.player.hasBoat, boatType: this.player.boatType,
        mainSkillId: this.player.mainSkillId,
        learnedSkills: { active: this.player.learnedSkills.active, passive: this.player.learnedSkills.passive },
        skillExp: {...this.player.skillExp},
        inventory: this.player.inventory,
        equipment: this.player.equipment,
        storage: this.player.storage,
        gameDay: GAME_TIME.day, gameHour: GAME_TIME.hour, gameMinute: GAME_TIME.minute,
      };
      localStorage.setItem("wasteland_save_1", JSON.stringify(data));
      this.player.addLog("💾 游戏已保存到槽位 1。");
    };

    // === 多次自动探索 ===
    window.startMultiExplore = (count) => {
      if (typeof count !== 'number' || count < 1) count = parseInt(count) || 5;
      if (this.multiExplore.active) { this.player.addLog("⚠️ 已经在自动探索中。"); return; }
      this.multiExplore = { active: true, totalRounds: count, completedRounds: 0,
        totalExp: 0, totalGold: 0, allItems: [], wins: 0, losses: 0 };
      this.player.addLog(`🤖 开始自动探索 ${count} 次...`);
      document.getElementById("modal-overlay").style.display = "none";
      this.doMultiExploreStep();
    };
    // 手动交付任务 — 向发布者汇报
    window.deliverQuest = (questId) => {
      const quest = this.questManager.activeQuests.find(q => q.id === questId);
      if (!quest) { this.player.addLog("⚠️ 任务不存在或已完成。"); return; }
      const allDone = quest.progress.every((p, i) => p.current >= quest.objectives[i].count);
      if (!allDone) { this.player.addLog("⚠️ 任务目标尚未完成，请继续努力。"); return; }

      // 显示发布者对话弹窗
      const giver = quest.giver || "神秘人";
      const giverCity = quest.giverCity || "未知地点";
      const rewardText = quest.rewardText || `"干得好！这是你应得的报酬。"`;

      const repeatCount = (this.questManager.completedCount[quest._trackId || quest.id] || 0);
      const halved = repeatCount > 0 && quest.repeatable;
      const mul = halved ? 0.5 : 1.0;
      const halvedTag = halved ? `（第${repeatCount + 1}次完成，奖励减半）` : "";

      let rewardPreview = "<div style='font-size:13px;color:#c8b87d;line-height:2;'>";
      if (halved) rewardPreview += `<p style='color:#ffa040;font-size:11px;'>⚠️ 此任务之前已完成 ${repeatCount} 次，奖励减半</p>`;
      const r = quest.rewards;
      if (r.exp) rewardPreview += `<p>⭐ 经验: <b style="color:#f0c040;">+${Math.floor(r.exp * mul)}</b>${halvedTag ? ` <span style="font-size:10px;color:#ffa040;">${halvedTag}</span>` : ''}</p>`;
      if (r.gold) rewardPreview += `<p>💰 金币: <b style="color:#ffc040;">+${Math.floor((Array.isArray(r.gold) ? Math.floor((r.gold[0]+r.gold[1])/2) : r.gold) * mul)}</b></p>`;
      if (r.items && !halved) rewardPreview += `<p>📦 物品: ${r.items.length}件</p>`;
      if (r.items && halved) rewardPreview += `<p style="color:#ffa040;">📦 物品: 减半概率获得</p>`;
      if (r.skill_book && !halved) {
        const bk = ALL_ITEMS[r.skill_book];
        rewardPreview += `<p>📖 技能书: ${bk ? bk.name : r.skill_book}</p>`;
      }
      if (r.skill_book && halved) {
        rewardPreview += `<p style="color:#5a5a4a;">📖 技能书: 不再获得</p>`;
      }
      if (r.stat && !halved) {
        rewardPreview += `<p>🧪 属性药水: ${statName(r.stat)}永久+1</p>`;
      }
      if (r.stat && halved) {
        rewardPreview += `<p style="color:#5a5a4a;">🧪 属性药水: 不再获得</p>`;
      }
      if (r.materials) {
        for (const m of r.materials) {
          const mi = ALL_ITEMS[m.id];
          const qty = Math.max(1, Math.floor((m.qty || 1) * mul));
          rewardPreview += `<p>🔩 ${mi ? mi.name : m.id} ×${qty}</p>`;
        }
      }
      rewardPreview += "</div>";

      let html = `
        <div style="text-align:center;">
          <h2 style="color:#f0c040;">📋 向发布者汇报</h2>
          <div style="background:#1a1008;padding:12px;border-radius:4px;margin:10px 0;border-left:3px solid #f0c040;">
            <p style="color:#c8b87d;font-size:14px;">👤 <b>${giver}</b> <span style="color:#5a5a4a;font-size:10px;">📍${giverCity}</span></p>
            <p style="color:#8a8a7a;font-size:12px;margin-top:8px;line-height:1.8;">"${rewardText}"</p>
          </div>
          <p style="color:#60c060;">✅ 任务: ${quest.name} - 已完成</p>
          <hr style="border-color:#4a3a2a;margin:10px 0;">
          ${rewardPreview}
          <button onclick="document.getElementById('modal-overlay').style.display='none';window.gameInstance._finishDeliverQuest('${quest.id}');"
            style="margin-top:12px;padding:10px 30px;font-family:inherit;font-size:16px;
            background:linear-gradient(180deg,#4a3a2a,#2a1a08);border:2px solid #f0c040;color:#f0c040;cursor:pointer;border-radius:3px;">
            🎁 领取奖励
          </button>
          <br>
          <button onclick="document.getElementById('modal-overlay').style.display='none';"
            style="margin-top:6px;padding:4px 16px;font-family:inherit;font-size:11px;
            background:transparent;border:none;color:#5a5a4a;cursor:pointer;">
            等会儿再领
          </button>
        </div>`;
      this.ui.showModal("交付任务", html);
    };

    // 完成交付（从弹窗回调）
    this._finishDeliverQuest = (questId) => {
      const quest = this.questManager.activeQuests.find(q => q.id === questId);
      if (!quest) return;
      this.completeQuest(quest);
      this.ui.updateAll();
    };

    // === 六边形地图旅行 ===
    window.startHexTravel = (targetX, targetY, distTiles, terrainName) => {
      this.player.addLog(`🗺️ 开始细粒度旅行：前往 ${terrainName} 区域。`);
      this.hexMap = new HexMap(this.player.lv, Math.floor(distTiles * 2)); // tiles→km映射
      this.hexTarget = { x: targetX, y: targetY, distTiles, terrainName };
      this._showHexMap();
    };

    this._showHexMap = () => {
      document.getElementById("hexmap-screen").style.display = "flex";
      document.getElementById("game-container").style.display = "none";
      if (document.getElementById("city-screen")) document.getElementById("city-screen").style.display = "none";
      if (document.getElementById("combat-screen")) document.getElementById("combat-screen").style.display = "none";
      this.ui.renderHexMap(this.hexMap);
      this.ui.updateHexTileInfo(this.hexMap);
    };

    window.leaveHexMap = () => {
      document.getElementById("hexmap-screen").style.display = "none";
      document.getElementById("game-container").style.display = "flex";
      const hx = this.hexMap;
      if (hx && hx.totalTime > 0) {
        advanceGameTime(hx.totalTime);
        this.player.addLog(`🚶 旅行结束，走了 ${hx.steps} 步，耗时 ${hx.totalTime} 分钟。`);
        const travelDist = Math.floor(hx.worldDist || hx.steps / 2);
        this.questManager.updateProgress("travel", travelDist);
        this.questManager.travelDistance += travelDist;
        if (this.hexTarget && this.hexTarget.terrainName === "海洋" && this.player.hasBoat) {
          this.questManager.updateProgress("sea_travel", travelDist);
        }
        this.questManager.checkCompletions();
      }
      this.hexMap = null;
      this.hexTarget = null;
      this.ui.updateAll();
    };

    // 六边形地图移动
    window.hexMove = (dx, dy) => {
      if (!this.hexMap) return;
      const result = this.hexMap.movePlayer(dx, dy);
      if (!result.moved) {
        this.player.addLog(`⚠️ ${result.reason || "无法移动"}。`);
      } else {
        advanceGameTime(result.timeCost);
        if (result.arrived) {
          this.player.addLog(`🎉 到达目的地！`);
          window.leaveHexMap();
          if (this.hexTarget) {
            this.player.position.x = this.hexTarget.x;
            this.player.position.y = this.hexTarget.y;
            this.worldMap.centerOn(this.hexTarget.x, this.hexTarget.y, 2);
            this.ui.updateActionPanel();
          }
          return;
        }
        if (result.content) {
          const ct = result.content;
          this.player.addLog(`📍 发现: ${ct.desc || ct.name}`);
          if (ct.id === 1) {
            // 敌人 - 进入战斗
            const enemyId = result.tile.enemyId || "mutant_rat";
            const template = ENEMY_TEMPLATES[enemyId];
            if (template) {
              document.getElementById("hexmap-screen").style.display = "none";
              document.getElementById("game-container").style.display = "flex";
              this.combat.startBattle(template);
              // 战斗结束后返回hexmap
              const origWin = this.combat.onWin;
              this.combat.onWin = (r) => {
                origWin(r);
                this.combat.onWin = origWin;
                setTimeout(() => this._showHexMap(), 500);
              };
              const origLose = this.combat.onLose;
              this.combat.onLose = () => {
                origLose();
                this.combat.onLose = origLose;
                this.hexMap = null;
                document.getElementById("hexmap-screen").style.display = "none";
                document.getElementById("game-container").style.display = "flex";
              };
              return;
            }
          } else if (ct.id === 2) {
            // 宝箱
            const gold = 20 + Math.floor(Math.random() * this.player.lv * 20);
            this.player.gold += gold;
            this.player.gainExp(30 + Math.floor(Math.random() * 40));
            this.player.addLog(`📦 打开宝箱，获得 ${gold} 金币！`);
            this.questManager.updateProgress("find_chest");
            this.questManager.updateProgress("gold_earn", gold);
          } else if (ct.id === 3) {
            // 药草
            const herb = ALL_ITEMS["bandage"] || ALL_ITEMS["health_potion_s"];
            if (herb) { this.player.addItem({ ...herb }); this.player.addLog(`🌿 采集到 ${herb.name}！`); }
          } else if (ct.id === 4) {
            // 废料
            const scrap = ALL_ITEMS["scrap_metal"];
            if (scrap) { this.player.addItem({ ...scrap, id: "scrap_metal" }); this.player.addLog(`🔩 捡到了废金属！`); }
          } else if (ct.id === 5) {
            // 商人
            const gold = 50 + Math.floor(Math.random() * 100);
            this.player.gold += gold;
            this.player.addLog(`🧑‍💼 遇到流浪商人，交易获利 ${gold} 金币！`);
          } else if (ct.id === 6) {
            // 神龛
            this.player.gainExp(50 + Math.floor(Math.random() * 80));
            this.player.addLog(`⛩️ 在古老神龛前祈祷，获得经验加成！`);
          }
        }
      }
      this.ui.renderHexMap(this.hexMap);
      this.ui.updateHexTileInfo(this.hexMap);
      this.ui.updateAll();
    };

    // 方向键绑定 - 六边形地图移动
    this.hexKeyHandler = (e) => {
      if (!this.hexMap) return;
      if (document.getElementById("hexmap-screen").style.display === "none") return;
      let dx = 0, dy = 0;
      switch (e.key) {
        case "ArrowUp": case "w": dy = -1; break;
        case "ArrowDown": case "s": dy = 1; break;
        case "ArrowLeft": case "a": dx = -1; break;
        case "ArrowRight": case "d": dx = 1; break;
        case "Escape": window.leaveHexMap(); return;
        default: return;
      }
      e.preventDefault();
      window.hexMove(dx, dy);
    };
    document.addEventListener("keydown", this.hexKeyHandler);

    // 六边形地图方向按钮点击
    document.querySelectorAll(".hex-dir").forEach(btn => {
      btn.addEventListener("click", () => {
        const dx = parseInt(btn.dataset.dx) || 0;
        const dy = parseInt(btn.dataset.dy) || 0;
        window.hexMove(dx, dy);
      });
    });

    // 六边形地图Canvas点击
    document.getElementById("hexmap-canvas").addEventListener("click", (e) => {
      if (!this.hexMap) return;
      const canvas = e.target;
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const cw = rect.width / 2;
      const ch = rect.height / 2;
      // 判断点击方向
      if (cx < cw - 40) window.hexMove(-1, 0);
      else if (cx > cw + 40) window.hexMove(1, 0);
      else if (cy < ch - 30) window.hexMove(0, -1);
      else if (cy > ch + 30) window.hexMove(0, 1);
    });

    window.stopMultiExplore = () => {
      if (this.multiExplore.active) {
        this.multiExplore.active = false;
        this.showMultiExploreResult();
      }
    };
  }

  // ===== 多次自动探索 =====
  doMultiExploreStep() {
    const me = this.multiExplore;
    if (!me.active) return;
    if (this.combat.active) return; // 等待战斗结束
    if (me.completedRounds >= me.totalRounds) { this.showMultiExploreResult(); return; }

    me.completedRounds++;
    // 执行一次探索
    const encounter = Math.random();
    if (encounter < 0.35) {
      // 战斗 - 自动模式（结果由 onBattleResult 统一追踪）
      const enemies = getEnemiesForLevel(this.player.lv);
      const template = enemies[Math.floor(Math.random() * enemies.length)];
      this.combat.startBattle(template);
      this.combat.autoMode = true;
      this.combat.autoTimer = setTimeout(() => this.combat.autoAction(), 600);
    } else if (encounter < 0.45) {
      // 宝箱
      const quality = randomQuality(this.player.lv);
      const gold = 20 + Math.floor(Math.random() * this.player.lv * 15);
      const expGain = 20 + Math.floor(Math.random() * 30);
      this.player.gold += gold;
      this.questManager.updateProgress("gold_earn", gold);
      this.questManager.goldEarned += gold;
      this.player.gainExp(expGain);
      me.totalGold += gold;
      me.totalExp += expGain;
      const equipPool = [...Object.values(WEAPON_BASE), ...Object.values(ARMOR_BASE)]
        .filter(e => Math.abs(e.minLv - this.player.lv) <= 5);
      if (equipPool.length > 0 && Math.random() < 0.5) {
        const base = equipPool[Math.floor(Math.random() * equipPool.length)];
        const eq = generateEquipItem(base, quality, this.player.lv);
        if (eq && this.player.addItem(eq)) me.allItems.push(eq.name + " [" + eq.qualityName + "]");
      }
      setTimeout(() => {
        if (me.completedRounds >= me.totalRounds) this.showMultiExploreResult();
        else setTimeout(() => this.doMultiExploreStep(), 400);
      }, 300);
    } else if (encounter < 0.55) {
      // 材料
      const mats = ["scrap_metal","steel_ingot","circuit_board","magic_crystal","mutant_gland","energy_cell"];
      const m = mats[Math.floor(Math.random() * mats.length)];
      const item = { ...ALL_ITEMS[m], id: m };
      if (this.player.addItem(item)) me.allItems.push(item.name);
      const minorExp = 5 + Math.floor(Math.random() * 8);
      this.player.gainExp(minorExp);
      me.totalExp += minorExp;
      setTimeout(() => {
        if (me.completedRounds >= me.totalRounds) this.showMultiExploreResult();
        else setTimeout(() => this.doMultiExploreStep(), 400);
      }, 300);
    } else {
      // 无事
      const minorExp = 3 + Math.floor(Math.random() * 6);
      this.player.gainExp(minorExp);
      me.totalExp += minorExp;
      setTimeout(() => {
        if (me.completedRounds >= me.totalRounds) this.showMultiExploreResult();
        else setTimeout(() => this.doMultiExploreStep(), 400);
      }, 150);
    }
  }

  showMultiExploreResult() {
    const me = this.multiExplore;
    this.multiExplore.active = false;
    let html = `<div style="text-align:center;">
      <h2 style="color:#f0c040;margin-bottom:12px;">🤖 自动探索完成</h2>
      <p style="color:#8a8a7a;">完成 ${me.completedRounds}/${me.totalRounds} 次探索</p>
      <hr style="border-color:#4a3a2a;margin:10px 0;">
      <div style="font-size:14px;color:#c8b87d;line-height:2.2;">
        <p>⚔️ 战斗: <span style="color:#60c060;">${me.wins}胜</span> <span style="color:#ff4040;">${me.losses}败</span></p>
        <p>⭐ 经验: <b style="color:#f0c040;">+${me.totalExp}</b></p>
        <p>💰 金币: <b style="color:#ffc040;">+${me.totalGold}</b></p>
        ${me.allItems.length > 0 ? `<p>📦 物品: ${me.allItems.join(', ')}</p>` : '<p>📦 物品: 无</p>'}
      </div>
      <button onclick="document.getElementById('modal-overlay').style.display='none';window.gameInstance.ui.updateAll();"
        style="margin-top:12px;padding:8px 24px;font-family:inherit;font-size:14px;
        background:linear-gradient(180deg,#3a2a10,#2a1a08);border:2px solid #4a3a2a;color:#c8b87d;cursor:pointer;border-radius:3px;">
        确认
      </button></div>`;
    this.ui.showModal("探索结果", html);
    this.ui.updateAll();
  }

  // ===== 按键处理 =====
  handleWorldKey(e) {
    // Ctrl+S 快速存档
    if (e.ctrlKey && e.key === "s") { e.preventDefault(); window.saveGame(); return; }
    // ESC 打开菜单
    if (e.key === "Escape") { window.toggleGameMenu(); return; }

    if (this.worldMap.isMoving) return;
    let dx = 0, dy = 0;
    switch (e.key) {
      case "ArrowUp": case "w": dy = -1; break;
      case "ArrowDown": case "s": dy = 1; break;
      case "ArrowLeft": case "a": dx = -1; break;
      case "ArrowRight": case "d": dx = 1; break;
      case "e":
        this.ui.actionExplore();
        break;
      case "c":
        const city = this.worldMap.findNearbyCity(3);
        if (city) this.enterCity(city);
        break;
    }
    if (dx !== 0 || dy !== 0) {
      this.worldMap.movePlayerByDirection(dx, dy);
    }
    this.ui.updateActionPanel();
  }

  handleCombatKey(e) {
    if (this.combat.turn !== "player") return;
    switch (e.key) {
      case "1": this.combat.playerAttack(); break;
      case "2": this.ui.showCombatSkills(); break;
      case "3": this.combat.playerDefend(); break;
      case "4": this.ui.showCombatItems(); break;
      case "5": this.combat.playerFlee(); break;
      case "a": this.combat.toggleAuto(); break;
    }
  }

  handleDungeonKey(e) {
    if (!this.currentDungeon) return;
    let dx = 0, dy = 0;
    switch (e.key) {
      case "ArrowUp": case "w": dy = -1; break;
      case "ArrowDown": case "s": dy = 1; break;
      case "ArrowLeft": case "a": dx = -1; break;
      case "ArrowRight": case "d": dx = 1; break;
    }
    if (dx !== 0 || dy !== 0) {
      const result = this.currentDungeon.movePlayer(dx, dy);
      if (result.moved) {
        this.onDungeonMove(result);
      }
    }
  }

  // ===== 世界交互 =====
  onWorldClick(city) {
    if (city.type === "dungeon") {
      this.player.addLog(`📍 发现了 ${city.name}：${city.desc}`);
      this.enterDungeon();
    } else {
      this.enterCity(city);
    }
  }

  onMapMove(data) {
    if (data.type === "blocked") {
      this.player.addLog("❌ " + data.msg);
    } else if (data.type === "move") {
      this.ui.updateActionPanel();
      const dist = data.dist || 0;
      this.questManager.updateProgress("travel", dist);
      this.questManager.travelDistance += dist;
      if (data.terrain === "海洋" && this.player.hasBoat) {
        this.questManager.updateProgress("sea_travel", dist);
      }
    } else if (data.type === "encounter") {
      this.ui.actionExplore();
    }
  }

  // ===== 城市 =====
  enterCity(city) {
    this.player.currentCity = city;
    this.ui.showCity(city);
    this.questManager.updateProgress("visit_city");
    this.questManager.checkCompletions();
  }

  leaveCity() {
    this.player.currentCity = null;
    this.ui.hideCity();
    this.ui.updateAll();
  }

  openShop() {
    const city = this.player.currentCity;
    if (!city) return;

    let html = `<h3>${city.name} 商店</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">`;
    // 药水
    const shopItems = ["health_potion_s", "health_potion_m", "mana_potion_s", "mana_potion_m", "bandage", "antidote", "stimulant"];
    for (const sid of shopItems) {
      const item = ALL_ITEMS[sid];
      if (!item) continue;
      html += `<div style="background:#1a1008;padding:8px;border-radius:3px;">
        <p><b>${item.name}</b></p>
        <p style="font-size:11px;">${item.desc || ""}</p>
        <p style="color:#ffc040;">${item.buyPrice}💰</p>
        <button class="btn-small" onclick="window.buyItem('${sid}')">购买</button>
      </div>`;
    }

    // 根据城市等级添加装备
    const equipPool = [...Object.values(WEAPON_BASE), ...Object.values(ARMOR_BASE)]
      .filter(e => e.minLv <= city.size * 5 + 5);
    const shownEquip = equipPool.slice(0, Math.min(8, equipPool.length));
    for (const eq of shownEquip) {
      html += `<div style="background:#1a1008;padding:8px;border-radius:3px;">
        <p><b>${eq.name}</b></p>
        <p style="font-size:11px;">Lv.${eq.minLv} | ${EQUIP_SLOT_NAMES[eq.slot]}</p>
        <p style="color:#ffc040;">${eq.buyPrice}💰</p>
        <button class="btn-small" onclick="window.buyEquip('${eq.id}')">购买</button>
      </div>`;
    }

    // 船只
    html += `<div style="background:#1a1008;padding:8px;border-radius:3px;">
      <p><b>⚓ 小木船</b></p>
      <p style="font-size:11px;">允许在海洋上航行</p>
      <p style="color:#ffc040;">500💰</p>
      <button class="btn-small" onclick="window.buyBoat('boat')">购买</button>
    </div>`;
    if (city.size >= 3) {
      html += `<div style="background:#1a1008;padding:8px;border-radius:3px;">
        <p><b>🚢 中型帆船</b></p>
        <p style="font-size:11px;">海洋航行速度+50%</p>
        <p style="color:#ffc040;">2000💰</p>
        <button class="btn-small" onclick="window.buyBoat('ship')">购买</button>
      </div>`;
    }
    if (city.size >= 5) {
      html += `<div style="background:#1a1008;padding:8px;border-radius:3px;">
        <p><b>🛳️ 铁甲战舰</b></p>
        <p style="font-size:11px;">海洋战力+100%，速度+100%</p>
        <p style="color:#ffc040;">8000💰</p>
        <button class="btn-small" onclick="window.buyBoat('warship')">购买</button>
      </div>`;
    }
    html += "</div>";

    this.ui.showModal("商店", html);

    window.buyItem = (itemId) => {
      const item = ALL_ITEMS[itemId];
      if (!item) return;
      if (this.player.gold < item.buyPrice) { this.player.addLog("金币不足！"); return; }
      this.player.gold -= item.buyPrice;
      const isStackable = this.player._isStackable(item);
      const newItem = { ...item, id: isStackable ? itemId : (itemId + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000)) };
      if (this.player.addItem(newItem)) {
        this.player.addLog(`🛒 购买了 ${item.name}。`);
      }
      this.ui.updateAll();
    };

    window.buyEquip = (equipId) => {
      const base = ALL_ITEMS[equipId];
      if (!base) return;
      if (this.player.gold < base.buyPrice) { this.player.addLog("金币不足！"); return; }
      const quality = randomQuality(this.player.lv);
      const eq = generateEquipItem(base, quality, this.player.lv);
      if (!eq) return;
      const price = Math.floor(base.buyPrice * QUALITY_COLORS[quality].mul);
      if (this.player.gold < price) { this.player.addLog("金币不足！"); return; }
      this.player.gold -= price;
      if (this.player.addItem(eq)) {
        this.player.addLog(`🛒 购买了 ${eq.name}[${eq.qualityName}]。`);
      }
      this.ui.updateAll();
    };

    window.buyBoat = (type) => {
      const prices = { boat: 500, ship: 2000, warship: 8000 };
      if (this.player.gold < prices[type]) { this.player.addLog("金币不足！"); return; }
      this.player.gold -= prices[type];
      this.player.hasBoat = true;
      this.player.boatType = type;
      const names = { boat: "小木船", ship: "中型帆船", warship: "铁甲战舰" };
      this.player.addLog(`⛵ 购买了 ${names[type]}！现在可以在海洋上航行了。`);
      this.ui.updateAll();
    };
  }

  openTrainer() {
    const city = this.player.currentCity;
    const citySize = city ? city.size : 1;

    const renderContent = () => {
      let html = ``;

      // 当前职业
      const currentProf = this.player.getProfession();
      html += `<p style="color:#8a8a7a;">当前职业: <b style="color:#f0c040;">${currentProf.icon} ${currentProf.name}</b> - ${currentProf.desc}</p>`;
      html += `<p style="font-size:11px;color:#5a5a4a;">职业由主要主动技能决定，点击"设为主技能"即可切换</p>`;

      // 已学技能 + 遗忘 + 主技能选择
      html += `<h4 style="margin-top:12px;">📚 已学技能 (主动: ${this.player.learnedSkills.active.length}/${this.player.getActiveSkillSlots()} | 被动: ${this.player.learnedSkills.passive.length}/${this.player.getMaxPassiveSlots()})</h4>`;
      html += `<div style="display:flex;flex-direction:column;gap:4px;max-height:180px;overflow-y:auto;">`;
      const allLearned = [...this.player.learnedSkills.active.map(s => ({...s, skillType:'active'})),
                          ...this.player.learnedSkills.passive.map(s => ({...s, skillType:'passive'}))];
      if (allLearned.length === 0) {
        html += `<p style="color:#5a5a4a;">尚未学习任何技能</p>`;
      } else {
        for (const sk of allLearned) {
          const def = ALL_SKILLS[sk.skillId];
          if (!def) continue;
          const prof = sk.skillType === "active" ? getProfessionBySkill(sk.skillId) : null;
          const isMain = this.player.mainSkillId === sk.skillId;
          const cdInfo = def.cooldown > 0 ? `<span style="color:#ffa040;font-size:10px;">⏳ CD:${def.cooldown}回合</span>` : "";
          html += `<div style="background:#1a1008;padding:8px;border-radius:3px;display:flex;align-items:center;justify-content:space-between;
            ${isMain ? 'border:2px solid #f0c040;' : 'border:1px solid #4a3a2a;'}">
            <div style="flex:1;">
              <span style="color:#c8b87d;">${def.name} Lv.${sk.lv}</span>
              <span style="color:#5a5a4a;font-size:10px;"> | ${sk.skillType === "active" ? "⚡" : "🔮"} ${skillCategoryName(def.category)}</span>
              ${cdInfo}
              ${isMain ? '<span style="color:#f0c040;font-size:10px;"> 【主技能】</span>' : ''}
              ${sk.skillType === "active" && !isMain && prof ? `<span style="color:#5a5a4a;font-size:10px;"> → ${prof.icon} ${prof.name}</span>` : ''}
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0;">
              ${sk.skillType === "active" && !isMain ? `<button class="btn-small" onclick="window.setMainSkillAtTrainer('${sk.skillId}')">设为主技能</button>` : ''}
              <button class="btn-small" onclick="window.forgetSkillAtTrainer('${sk.skillId}')" style="color:#ff6060;">遗忘</button>
            </div>
          </div>`;
        }
      }
      html += `</div>`;

      // 可学习技能列表（基于玩家等级）
      html += `<h4 style="margin-top:16px;">📖 可学习技能 (角色等级: Lv.${this.player.lv})</h4>`;
      html += `<div style="display:flex;flex-direction:column;gap:6px;max-height:250px;overflow-y:auto;">`;
      const learnable = getLearnableSkills(this.player.lv, this.player.learnedSkills.active, this.player.learnedSkills.passive);
      const allLearnableIds = [...learnable.active, ...learnable.passive];
      let hasAny = false;

      for (const sid of allLearnableIds) {
        const def = ALL_SKILLS[sid];
        if (!def) continue;
        hasAny = true;
        let canLearn = true;
        let reqText = [];
        if (def.learnReq) {
          const stats = this.player.getStats();
          for (const key in def.learnReq) {
            reqText.push(`${statName(key) || "等级"} ${def.learnReq[key]}`);
            if (key !== "lv" && stats[key] < def.learnReq[key]) canLearn = false;
          }
        }
        if (!def.buyPrice) canLearn = false;
        const cdInfo = def.cooldown > 0 ? ` ⏳CD:${def.cooldown}回合` : "";

        html += `<div style="background:#1a1008;padding:8px;border-radius:3px;display:flex;align-items:center;justify-content:space-between;
          ${canLearn ? 'border:1px solid #4a3a2a;' : 'border:1px solid #2a1a08;opacity:0.6;'}">
          <div>
            <span style="color:#c8b87d;">${def.name}</span>
            <span style="color:#5a5a4a;font-size:10px;"> | Lv.${def.learnReq?.lv || 1} | ${def.type === "active" ? "⚡主动" : "🔮被动"} | ${skillCategoryName(def.category)}${cdInfo}</span>
            <div style="font-size:10px;color:#8a8a7a;">${def.desc}</div>
            <div style="font-size:10px;color:#5a5a4a;">💰 ${def.buyPrice}金币 ${reqText.length ? '| 需求: ' + reqText.join(', ') : ''}</div>
          </div>
          ${canLearn ? `<button class="btn-small" onclick="window.learnSkillAtTrainer('${sid}', ${def.buyPrice})">学习</button>` : '<span style="color:#ff4040;font-size:10px;">🔒</span>'}
        </div>`;
      }
      if (!hasAny) {
        const next = getNextLearnableSkills(this.player.lv, this.player.learnedSkills.active, this.player.learnedSkills.passive);
        const nextAll = [...next.active, ...next.passive];
        if (nextAll.length > 0) {
          nextAll.sort((a, b) => a.lv - b.lv);
          html += `<p style="color:#5a5a4a;">📖 全部可学技能已学会！下一技能在 Lv.${nextAll[0].lv}: ${ALL_SKILLS[nextAll[0].id]?.name || ""}</p>`;
        } else {
          html += `<p style="color:#f0c040;">🎉 已学会所有技能！</p>`;
        }
      }
      html += `</div>`;

      // 更新弹窗内容
      document.getElementById("modal-title").textContent = "📚 技能教官";
      document.getElementById("modal-body").innerHTML = html;
    }; // end renderContent

    // 显示弹窗并渲染
    this.ui.showModal("技能教官", "");
    renderContent();

    window.setMainSkillAtTrainer = (skillId) => {
      this.player.mainSkillId = skillId;
      const prof = this.player.getProfession();
      this.player.addLog(`📚 主要技能已更换！职业变更为: ${prof.icon} ${prof.name}`);
      renderContent();
      this.ui.updateAll();
    };

    window.forgetSkillAtTrainer = (skillId) => {
      const def = ALL_SKILLS[skillId];
      const skillName = def ? def.name : skillId;
      if (!confirm(`确定要遗忘【${skillName}】吗？\n\n遗忘后技能将永久失去，需要重新学习。`)) return;
      // 如果遗忘的是主技能，清空主技能
      if (this.player.mainSkillId === skillId) {
        this.player.mainSkillId = null;
      }
      const result = this.player.forgetSkill(skillId);
      if (result.success) {
        this.player.addLog(`💔 遗忘了技能: ${skillName}`);
        renderContent();
        this.ui.updateAll();
      }
    };

    window.learnSkillAtTrainer = (skillId, price) => {
      if (this.player.gold < price) {
        this.player.addLog("❌ 金币不足！");
        return;
      }
      const result = this.player.learnSkill(skillId);
      if (result.success) {
        this.player.gold -= price;
        this.player.addLog(`📚 学会了新技能: ${ALL_SKILLS[skillId].name}！花费 ${price} 金币。`);
        renderContent();
        this.ui.updateAll();
      } else {
        this.player.addLog(`❌ 无法学习: ${result.reason}`);
      }
    };
  }

  cityInnRest() {
    const cost = 20 + Math.floor(this.player.lv * 2);
    if (this.player.gold < cost) {
      this.player.addLog("金币不足，无法住店。");
      return;
    }
    this.player.gold -= cost;
    const cs = this.player.getCombatStats();
    this.player.addLog(`🏨 在旅馆休息了一晚，完全恢复了！花费 ${cost} 金币。`);
    this.ui.updateAll();
  }

  openBlacksmith() {
    let html = `<h3>铁匠铺 - 强化装备</h3>`;
    html += `<p style="color:#5a5a4a">铁匠可以帮你强化装备（功能开发中）。</p>`;
    html += `<p>当前装备：</p>`;
    for (const slot in this.player.equipment) {
      const eq = this.player.equipment[slot];
      if (eq) {
        html += `<p>${EQUIP_SLOT_NAMES[slot]}: <span style="color:${eq.qualityColor}">${eq.name}</span></p>`;
      }
    }
    html += `<button class="btn-small" onclick="window.repairAll()">修理所有装备 (50💰)</button>`;
    this.ui.showModal("铁匠铺", html);

    window.repairAll = () => {
      if (this.player.gold < 50) { this.player.addLog("金币不足。"); return; }
      this.player.gold -= 50;
      this.player.addLog("🔨 所有装备已修理完毕。");
      this.ui.updateAll();
    };
  }

  openQuestBoard() {
    const playerLv = this.player.lv;
    // 生成3个可选支线任务
    const quests = [];
    for (let i = 0; i < 3; i++) {
      quests.push(this.questManager.getBoardQuest(playerLv));
    }

    let html = `<h3>📋 任务板 - 可选支线任务</h3>`;
    html += `<p style="font-size:11px;color:#5a5a4a;margin-bottom:8px;">选择以下支线任务之一接受。已完成的可重复接取但奖励减半。</p>`;
    html += `<div style="display:flex;flex-direction:column;gap:8px;max-height:400px;overflow-y:auto;">`;

    for (let qi = 0; qi < quests.length; qi++) {
      const quest = quests[qi];
      const doneCount = this.questManager.completedCount[quest.id] || 0;
      const halvedInfo = quest.repeatable
        ? (doneCount > 0 ? `<span style="color:#ffa040;font-size:10px;">已做${doneCount}次 · 本次奖励减半</span>` : `<span style="color:#60c060;font-size:10px;">可重复接取</span>`)
        : "";

      html += `<div style="background:#1a1008;padding:10px;border-radius:3px;border:1px solid #4a3a2a;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#c8b87d;">📋 ${quest.name}</b>
          ${halvedInfo}
        </div>
        <div style="font-size:10px;color:#8a8a7a;margin:2px 0;">👤 ${quest.giver || '???'} · 📍 ${quest.giverCity || '???'}</div>
        <div style="font-size:11px;color:#8a8a7a;margin:4px 0;">${quest.desc}</div>`;
      for (const obj of quest.objectives) {
        html += `<div style="font-size:10px;color:#5a5a4a;">▸ ${obj.desc.replace(/\{current\}/g, '0').replace(/\{count\}/g, String(obj.count))}</div>`;
      }
      html += `<div style="font-size:10px;color:#5a5a4a;margin-top:4px;">🎁 `;
      if (quest.rewards.exp) html += `⭐${quest.rewards.exp} `;
      if (quest.rewards.gold) html += `💰${Array.isArray(quest.rewards.gold) ? quest.rewards.gold.join('~') : quest.rewards.gold} `;
      if (quest.rewards.skill_book) html += `📖技能书 `;
      if (quest.rewards.stat) html += `🧪属性药水 `;
      html += `</div>`;
      html += `<button class="btn-small" onclick="window.acceptBoardQuestById('${quest.id}')" style="margin-top:6px;width:100%;">接受任务</button>`;
      html += `</div>`;

      // 把生成的quest对象存到全局临时位置
      window._boardQuests = window._boardQuests || {};
      window._boardQuests[quest.id] = quest;
    }

    html += `</div>`;
    html += `<div style="margin-top:10px;text-align:center;">
      <button class="btn-small" onclick="window.refreshQuestBoard()">🔄 刷新任务</button>
    </div>`;

    this.ui.showModal("任务板", html);

    window.acceptBoardQuestById = (qid) => {
      const quest = window._boardQuests[qid];
      if (!quest) { this.player.addLog("⚠️ 任务已过期。"); return; }
      if (this.questManager.acceptQuest(quest)) {
        this.player.addLog(`📋 接受了支线任务: ${quest.name}（发布者: ${quest.giver}）`);
        this.ui.updateAll();
        document.getElementById("modal-overlay").style.display = "none";
      } else {
        this.player.addLog("⚠️ 无法接受此任务。");
      }
    };

    window.refreshQuestBoard = () => {
      document.getElementById("modal-overlay").style.display = "none";
      setTimeout(() => this.openQuestBoard(), 100);
    };
  }

  completeQuest(quest) {
    const q = this.questManager.completeQuest(quest.id);
    if (!q) return;

    // 重复完成的任务奖励减半
    const trackId = q._trackId || q.id;
    const repeatCount = (this.questManager.completedCount[trackId] || 0) - 1; // 之前完成次数（减1因为刚+1）
    const halved = repeatCount > 0 && q.repeatable;
    const mul = halved ? 0.5 : 1.0;

    const halvedTag = halved ? ' (重复完成，奖励减半)' : '';

    this.player.gainExp(Math.floor(q.rewards.exp * mul));
    if (q.rewards.gold) {
      if (Array.isArray(q.rewards.gold)) {
        const [min, max] = q.rewards.gold;
        this.player.gold += Math.floor((Math.floor(Math.random() * (max - min + 1)) + min) * mul);
      } else {
        this.player.gold += Math.floor(q.rewards.gold * mul);
      }
    }
    // 物品奖励
    if (q.rewards.items) {
      for (const itemId of q.rewards.items) {
        if (halved && Math.random() > 0.5) continue; // 减半时有概率跳过物品
        const baseItem = ALL_ITEMS[itemId];
        if (baseItem) {
          const isStackable = this.player._isStackable(baseItem);
          const item = { ...baseItem, id: isStackable ? itemId : (itemId + "_reward_" + Date.now() + "_" + Math.floor(Math.random() * 1000)) };
          this.player.addItem(item);
        }
      }
    }
    // 技能书奖励（重复完成不给技能书）
    if (q.rewards.skill_book && !halved) {
      const bookItem = ALL_ITEMS[q.rewards.skill_book];
      if (bookItem) {
        this.player.addItem({ ...bookItem });
        this.player.addLog(`📖 获得技能书: ${bookItem.name}`);
      }
    }
    // 属性药水奖励（重复完成不给）
    if (q.rewards.stat && !halved) {
      const potionId = "stat_potion_" + q.rewards.stat;
      const potion = ALL_ITEMS[potionId];
      if (potion) {
        this.player.addItem({ ...potion });
        this.player.addLog(`🧪 获得属性药水: ${potion.name}`);
      }
    }
    // 材料奖励（数量减半）
    if (q.rewards.materials) {
      for (const mat of q.rewards.materials) {
        const baseItem = ALL_ITEMS[mat.id];
        if (baseItem) {
          const qty = Math.max(1, Math.floor((mat.qty || 1) * mul));
          this.player.addItem({ ...baseItem, id: mat.id }, qty);
          this.player.addLog(`📦 获得 ${baseItem.name}${qty > 1 ? ' x' + qty : ''}`);
        }
      }
    }
    const giver = q.giver || "神秘人";
    this.player.addLog(`✅ 向 ${giver} 交付了任务【${q.name}】！${halvedTag}`);
    advanceGameTime(60 + Math.floor(Math.random() * 60)); // 交付任务耗时1-2小时

    // 主线任务：自动接受下一个
    if (q.nextQuest) {
      const next = QUEST_TEMPLATES.find(t => t.id === q.nextQuest);
      if (next) this.questManager.acceptQuest(next);
    }
    // 更新章节信息
    if (q.chapter) this.questManager.currentChapter = q.chapter;
    this.ui.updateAll();
  }

  // ===== 副本系统 =====
  enterDungeon() {
    this.currentDungeon = new DungeonGenerator(this.player.lv);
    const info = this.currentDungeon.generate();
    this.player.addLog(`🏚️ 进入副本【${info.name}】(${info.theme})`);
    this.player.addLog(`📐 迷宫大小: ${info.width}x${info.height}，房间数: ${info.rooms}，敌人: ${info.enemies}`);

    // 用弹窗模拟副本界面
    this.renderDungeonModal();
  }

  renderDungeonModal() {
    const dung = this.currentDungeon;
    if (!dung) return;
    const info = dung.getInfo();

    let html = `<div style="text-align:center;">`;
    html += `<h3>🏚️ ${info.name} (Lv.${info.lv})</h3>`;
    html += `<p style="font-size:12px;color:#5a5a4a">${info.theme}</p>`;
    html += `<p style="font-size:11px;">敌人剩余: ${info.enemies} | 宝箱: ${info.chests} | 出口: ⭐</p>`;
    html += `<p style="font-size:11px;color:#5a5a4a">使用 方向键/WASD 移动，探索迷宫找到出口</p>`;
    html += `</div>`;

    // 迷宫渲染
    html += `<div style="font-family:monospace;font-size:12px;line-height:1.2;text-align:center;background:#0a0805;padding:10px;border-radius:4px;overflow:auto;max-height:400px;">`;
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (info.playerPos.x === x && info.playerPos.y === y) {
          html += `<span style="color:#f0d060;font-weight:bold;">@</span>`;
        } else if (!info.explored[y][x]) {
          html += `<span style="color:#1a1a1a;">·</span>`;
        } else {
          const tile = info.grid[y][x];
          switch (tile) {
            case 0: html += `<span style="color:#4a3a2a;">#</span>`; break;
            case 1: html += `<span style="color:#2a2a1a;">·</span>`; break;
            case 2: html += `<span style="color:#60c060;">▼</span>`; break;
            case 3: html += `<span style="color:#ffc040;">★</span>`; break;
            case 4: html += `<span style="color:#ff6060;">📦</span>`; break;
            default: html += `<span style="color:#2a2a1a;">·</span>`;
          }
        }
      }
      html += `<br>`;
    }
    html += `</div>`;
    html += `<div style="margin-top:8px;text-align:center;">
      <button class="btn-small" onclick="window.dungeonLeave()">退出副本</button>
      <button class="btn-small" onclick="window.dungeonMove(-1,0)">⬅️</button>
      <button class="btn-small" onclick="window.dungeonMove(0,-1)">⬆️</button>
      <button class="btn-small" onclick="window.dungeonMove(0,1)">⬇️</button>
      <button class="btn-small" onclick="window.dungeonMove(1,0)">➡️</button>
    </div>`;

    this.ui.showModal(`副本: ${info.name}`, html);

    window.dungeonMove = (dx, dy) => {
      if (!this.currentDungeon) return;
      const result = this.currentDungeon.movePlayer(dx, dy);
      if (result.moved) {
        this.onDungeonMove(result);
      } else if (result.reason === "墙壁") {
        this.player.addLog("🧱 前方是墙壁。");
      }
    };

    window.dungeonLeave = () => {
      this.currentDungeon = null;
      document.getElementById("modal-overlay").style.display = "none";
      this.player.addLog("🚪 离开了副本。");
    };
  }

  onDungeonMove(result) {
    if (result.reachedExit) {
      this.player.addLog("🎉 找到了出口！副本完成！");
      const bonusExp = this.currentDungeon.lv * 30;
      this.player.gainExp(bonusExp);
      this.player.addLog(`获得额外经验: ${bonusExp}`);
      this.questManager.updateProgress("complete_dungeon");
      this.questManager.checkCompletions();
      this.currentDungeon = null;
      document.getElementById("modal-overlay").style.display = "none";
      this.ui.updateAll();
      return;
    }

    if (result.foundChest) {
      const loot = this.currentDungeon.openChest(result.foundChest);
      let lootMsg = "📦 打开了宝箱！获得: ";
      for (const l of loot) {
        if (l.type === "gold") { this.player.gold += l.amount; this.questManager.updateProgress("gold_earn", l.amount); this.questManager.goldEarned += l.amount; lootMsg += `${l.amount}金币 `; }
        else if (l.type === "item") {
          const item = { ...l.item, id: l.item.id };
          this.player.addItem(item, l.qty || 1);
          lootMsg += `${l.item.name}${l.qty ? "x" + l.qty : ""} `;
        } else if (l.type === "equip") {
          this.player.addItem(l.item);
          lootMsg += `${l.item.name}[${l.item.qualityName}] `;
        }
      }
      this.player.addLog(lootMsg);
    }

    if (result.foundEnemy) {
      const enemy = this.currentDungeon.getEnemyAt(result.foundEnemy.x, result.foundEnemy.y);
      if (enemy) {
        this.currentDungeon.defeatEnemy(enemy);
        // 进入战斗
        const origWin = this.combat.onWin;
        const origLose = this.combat.onLose;
        this.combat.onWin = (r) => {
          origWin(r); // 先触发原始回调(任务进度/UI更新)
          this.player.addLog(`副本战斗胜利！获得 ${r.exp} 经验。`);
          this.combat.onWin = origWin;
          this.combat.onLose = origLose;
          this.renderDungeonModal();
        };
        this.combat.onLose = () => {
          origLose(); // 先触发原始回调
          this.combat.onWin = origWin;
          this.combat.onLose = origLose;
          this.currentDungeon = null;
          document.getElementById("modal-overlay").style.display = "none";
          this.ui.updateAll();
        };
        document.getElementById("modal-overlay").style.display = "none";
        this.combat.startBattle(enemy.enemy);
        return;
      }
    }

    this.renderDungeonModal();
  }

  onDungeonEnemyDefeated() {
    // 战斗胜利后重新打开副本界面
    if (this.currentDungeon) {
      this.renderDungeonModal();
    }
  }
}
