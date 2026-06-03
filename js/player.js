// ===== 玩家角色系统 =====

class Player {
  constructor(name = "流浪者") {
    this.name = name;
    this.onLevelUp = null;    // 等级提升回调
    this.onItemAdded = null; // 物品获得回调

    // 等级系统
    this.lv = 1;
    this.exp = 0;        // 已分配经验（给角色等级的）
    this.freeExp = 0;    // 未分配经验
    this.expToNext = 100; // 升级所需经验

    // 基础属性
    this.baseStats = {
      str: 5,  // 力量 - 物理攻击
      agi: 5,  // 敏捷 - 速度/闪避
      int: 5,  // 智力 - 魔法攻击
      vit: 5,  // 体力 - 生命值
      wis: 5,  // 智慧 - 魔法防御/MP
      ene: 5,  // 精力 - 暴击/韧性
    };

    // 额外属性点数
    this.freeStatPoints = 0;

    // 技能经验 (技能ID -> 经验值)
    this.skillExp = {};

    // 装备
    this.equipment = {
      weapon: null, head: null, body: null, belt: null,
      pants: null, shoes: null, ring: null, necklace: null, amulet: null
    };

    // 背包
    this.inventory = [];
    this.maxInventory = 30;

    // 储藏室（在各城市中可访问）
    this.storage = [];
    this.storageMax = 10000;
    this.storageMaxStack = 9999;

    // 金币
    this.gold = 0;

    // 已学技能
    this.learnedSkills = {
      active: [],   // [{ skillId, lv: 1-10 }]
      passive: [],  // [{ skillId, lv: 1-10 }]
    };
    this.mainSkillId = null; // 主主动技能ID (决定职业)

    // 游戏进度
    this.position = { x: 256, y: 256 }; // 世界中心 (tile坐标)
    this.currentCity = null;
    this.inDungeon = false;
    this.hasBoat = false;
    this.boatType = null; // 'boat' | 'ship' | 'warship'

    // 日志
    this.log = ["废土历2187年，你从废墟中醒来，踏上了冒险之旅..."];

    // 状态
    this.statusEffects = []; // [{ type, turns, data }]
  }

  // ===== 计算属性 =====
  getStats() {
    const s = { ...this.baseStats };
    // 被动技能加成
    for (const sk of this.learnedSkills.passive) {
      const def = ALL_SKILLS[sk.skillId];
      if (def && def.statBonus) {
        for (const key in def.statBonus) {
          s[key] = (s[key] || 0) + def.statBonus[key];
        }
      }
    }
    // 装备加成
    for (const slot in this.equipment) {
      const eq = this.equipment[slot];
      if (eq && eq.stats) {
        for (const key in eq.stats) {
          if (["atk","matk","def","mdef","spd","hp","mp","crit","dodge"].includes(key)) continue;
          s[key] = (s[key] || 0) + eq.stats[key];
        }
      }
    }
    return s;
  }

  getCombatStats() {
    const s = this.getStats();
    let atk = 2 + s.str * 2;
    let matk = 2 + s.int * 2;
    let def = 1 + s.vit;
    let mdef = 1 + s.wis;
    let spd = 5 + s.agi * 1.5;
    let maxHp = 50 + s.vit * 10;
    let maxMp = 20 + s.wis * 6;
    let crit = s.ene * 1.5;
    let dodge = s.agi * 0.8;

    // 装备加成
    for (const slot in this.equipment) {
      const eq = this.equipment[slot];
      if (eq && eq.stats) {
        atk += (eq.stats.atk || 0);
        matk += (eq.stats.matk || 0);
        def += (eq.stats.def || 0);
        mdef += (eq.stats.mdef || 0);
        spd += (eq.stats.spd || 0);
        maxHp += (eq.stats.hp || 0);
        maxMp += (eq.stats.mp || 0);
        crit += (eq.stats.crit || 0);
        dodge += (eq.stats.dodge || 0);
      }
    }

    // 被动技能加成
    for (const sk of this.learnedSkills.passive) {
      const def = ALL_SKILLS[sk.skillId];
      if (def && def.statBonus) {
        if (def.statBonus.atkBonus) atk = Math.floor(atk * (1 + def.statBonus.atkBonus / 100));
        if (def.statBonus.matkBonus) matk = Math.floor(matk * (1 + def.statBonus.matkBonus / 100));
        if (def.statBonus.defBonus) def = Math.floor(def * (1 + def.statBonus.defBonus / 100));
        if (def.statBonus.spdBonus) spd = Math.floor(spd * (1 + def.statBonus.spdBonus / 100));
        if (def.statBonus.dodgeBonus) dodge += def.statBonus.dodgeBonus;
        if (def.statBonus.critBonus) crit += def.statBonus.critBonus;
        if (def.statBonus.hpBonus) maxHp = Math.floor(maxHp * (1 + def.statBonus.hpBonus / 100));
        if (def.statBonus.mpBonus) maxMp = Math.floor(maxMp * (1 + def.statBonus.mpBonus / 100));
      }
    }

    // 职业加成
    const prof = getProfessionBySkill(this.mainSkillId);
    if (prof.bonuses.atkPct) atk = Math.floor(atk * (1 + prof.bonuses.atkPct / 100));
    if (prof.bonuses.matkPct) matk = Math.floor(matk * (1 + prof.bonuses.matkPct / 100));
    if (prof.bonuses.hpPct) maxHp = Math.floor(maxHp * (1 + prof.bonuses.hpPct / 100));
    if (prof.bonuses.mpPct) maxMp = Math.floor(maxMp * (1 + prof.bonuses.mpPct / 100));

    return {
      atk: Math.floor(atk), matk: Math.floor(matk),
      def: Math.floor(def), mdef: Math.floor(mdef),
      spd: Math.floor(spd), maxHp: Math.floor(maxHp), maxMp: Math.floor(maxMp),
      crit: Math.min(80, Math.floor(crit)), dodge: Math.min(50, Math.floor(dodge)),
      hp: Math.floor(maxHp), mp: Math.floor(maxMp)
    };
  }

  getProfession() { return getProfessionBySkill(this.mainSkillId); }

  getActiveSkillSlots() { return getActiveSkillSlots(this.lv); }
  getMaxPassiveSlots() { return getMaxPassiveSlots(this.lv); }

  // ===== 经验与升级 =====
  gainExp(amount) {
    this.freeExp += amount;
    return this.freeExp;
  }

  allocateExpToLevel(amount) {
    if (amount <= 0) amount = this.freeExp; // 分配全部
    amount = Math.min(amount, this.freeExp);
    if (amount <= 0) return false;
    this.freeExp -= amount;
    this.exp += amount;
    this.addLog(`分配了 ${amount} 点经验到角色等级。`);
    this.checkLevelUp();
    return true;
  }

  allocateExpToSkill(skillId, amount) {
    if (amount <= 0) amount = this.freeExp;
    amount = Math.min(amount, this.freeExp);
    if (amount <= 0) return false;

    // 检查是否拥有该技能
    const allSkills = [...this.learnedSkills.active, ...this.learnedSkills.passive];
    const skill = allSkills.find(s => s.skillId === skillId);
    if (!skill) return false;
    if (skill.lv >= 10) return false; // 技能最高10级

    this.freeExp -= amount;
    this.skillExp[skillId] = (this.skillExp[skillId] || 0) + amount;
    this.addLog(`分配了 ${amount} 点经验到技能。`);
    this.checkSkillLevelUp(skillId);
    return true;
  }

  checkLevelUp() {
    let leveled = false;
    while (this.exp >= this.expToNext && this.lv < 100) {
      this.exp -= this.expToNext;
      this.lv++;
      this.freeStatPoints += 3;
      this.expToNext = this.calcExpToNext(this.lv + 1);
      this.addLog(`🎉 角色等级提升至 Lv.${this.lv}！获得3点属性点。`);
      leveled = true;
      if (this.onLevelUp) this.onLevelUp(this.lv);
    }
    return leveled;
  }

  checkSkillLevelUp(skillId) {
    const expNeeded = this.calcSkillExpToNext(skillId);
    const current = this.skillExp[skillId] || 0;
    if (current >= expNeeded) {
      const allSkills = [...this.learnedSkills.active, ...this.learnedSkills.passive];
      const skill = allSkills.find(s => s.skillId === skillId);
      if (skill && skill.lv < 10) {
        this.skillExp[skillId] -= expNeeded;
        skill.lv++;
        this.addLog(`📚 技能 ${ALL_SKILLS[skillId].name} 提升至 Lv.${skill.lv}！`);
        return true;
      }
    }
    return false;
  }

  calcExpToNext(lv) {
    return Math.floor(100 * Math.pow(1.2, lv - 1));
  }

  calcSkillExpToNext(skillId) {
    const allSkills = [...this.learnedSkills.active, ...this.learnedSkills.passive];
    const skill = allSkills.find(s => s.skillId === skillId);
    if (!skill) return 50;
    return Math.floor(50 * Math.pow(1.5, skill.lv));
  }

  allocateStatPoint(stat) {
    if (this.freeStatPoints <= 0) return false;
    if (!this.baseStats.hasOwnProperty(stat)) return false;
    this.baseStats[stat]++;
    this.freeStatPoints--;
    this.addLog(`📈 ${statName(stat)} +1 (剩余点数: ${this.freeStatPoints})`);
    return true;
  }

  // ===== 技能管理 =====
  learnSkill(skillId) {
    const def = ALL_SKILLS[skillId];
    if (!def) return { success: false, reason: "技能不存在" };

    if (def.type === "active") {
      if (this.learnedSkills.active.length >= this.getActiveSkillSlots()) {
        return { success: false, reason: "主动技能槽已满" };
      }
      if (this.learnedSkills.active.find(s => s.skillId === skillId)) {
        return { success: false, reason: "已经学会该技能" };
      }
      this.learnedSkills.active.push({ skillId, lv: 1 });
    } else {
      if (this.learnedSkills.passive.length >= this.getMaxPassiveSlots()) {
        return { success: false, reason: "被动技能槽已满（最多2个）" };
      }
      if (this.learnedSkills.passive.find(s => s.skillId === skillId)) {
        return { success: false, reason: "已经学会该技能" };
      }
      this.learnedSkills.passive.push({ skillId, lv: 1 });
    }
    this.skillExp[skillId] = 0;
    this.addLog(`✨ 学会了新技能: ${def.name}！`);
    return { success: true };
  }

  forgetSkill(skillId) {
    for (const list of [this.learnedSkills.active, this.learnedSkills.passive]) {
      const idx = list.findIndex(s => s.skillId === skillId);
      if (idx >= 0) {
        const def = ALL_SKILLS[skillId];
        list.splice(idx, 1);
        delete this.skillExp[skillId];
        this.addLog(`💔 遗忘了技能: ${def ? def.name : skillId}`);
        return { success: true };
      }
    }
    return { success: false, reason: "未找到该技能" };
  }

  // ===== 装备管理 =====
  equipItem(item) {
    if (!item) return false;

    // 检查是否是船类物品
    if (item.type === "special" || item.id === "boat" || item.id === "ship" || item.id === "warship") {
      this.hasBoat = true;
      this.boatType = item.id;
      this.addLog(`⛵ 获得了 ${item.name}，现在可以在海洋上航行了！`);
      return true;
    }

    // 接受 type==="equipment" 或有合法装备槽位的物品
    const isEquip = item.type === "equipment" || (item.slot && EQUIP_SLOT_NAMES[item.slot]);
    if (!isEquip) return false;

    // 检查等级要求
    const minLv = item.minLv || 1;
    if (minLv > this.lv) {
      this.addLog(`❌ 等级不足：${item.name} 需要 Lv.${minLv}`);
      return false;
    }

    const slot = item.slot;
    if (!this.equipment.hasOwnProperty(slot)) return false;

    // 卸下旧装备
    const old = this.equipment[slot];
    if (old) this.inventory.push(old);

    // 从背包移除（支持堆叠）
    const invIdx = this.inventory.findIndex(i => i.id === item.id);
    if (invIdx >= 0) {
      const stack = this.inventory[invIdx];
      if (this._isStackable(stack) && (stack.qty || 1) > 1) {
        stack.qty--;
      } else {
        this.inventory.splice(invIdx, 1);
      }
    }

    this.equipment[slot] = item;
    this.addLog(`⚔️ 装备了 ${item.name}。`);
    return true;
  }

  unequipSlot(slot) {
    if (!this.equipment.hasOwnProperty(slot)) return false;
    const item = this.equipment[slot];
    if (!item) return false;
    if (this.inventory.length >= this.getMaxInventory()) {
      this.addLog("❌ 背包已满，无法卸下装备。");
      return false;
    }
    this.inventory.push(item);
    this.equipment[slot] = null;
    this.addLog(`🔧 卸下了 ${item.name}。`);
    return true;
  }

  // ===== 背包管理 =====
  // 物品是否可堆叠
  _isStackable(item) {
    if (!item) return false;
    if (item.type === "consumable" || item.type === "material") return true;
    if (item.type === "special" && !item.slot) return true;
    return false;
  }

  addItem(item, qty) {
    qty = qty || 1;
    if (qty <= 0) return false;
    let added = false;
    if (this._isStackable(item)) {
      const existing = this.inventory.find(i =>
        i.id === item.id && this._isStackable(i) && (i.qty || 1) < 999
      );
      if (existing) {
        existing.qty = (existing.qty || 1) + qty;
        if (existing.qty > 999) existing.qty = 999;
        added = true;
      }
    }
    if (!added) {
      if (this.inventory.length >= this.getMaxInventory()) return false;
      item.qty = this._isStackable(item) ? Math.min(qty, 999) : 1;
      this.inventory.push(item);
    }
    // 触发任务进度更新
    if (this.onItemAdded) this.onItemAdded(item.id);
    return true;
  }

  countItem(itemId) {
    let total = 0;
    for (const item of this.inventory) {
      if (item.id === itemId) {
        total += this._isStackable(item) ? (item.qty || 1) : 1;
      }
    }
    return total;
  }

  // ===== 储藏室 =====
  depositToStorage(itemId, qty) {
    const idx = this.inventory.findIndex(i => i.id === itemId);
    if (idx < 0) return { success: false, reason: "物品不存在" };
    const item = this.inventory[idx];
    const isStackable = this._isStackable(item);
    if (!isStackable && qty > 1) qty = 1;

    // 从背包移除
    if (isStackable) {
      const avail = item.qty || 1;
      qty = Math.min(qty, avail);
      if (qty <= 0) return { success: false, reason: "数量不足" };

      // 存入储藏室
      const stored = this.storage.find(i => i.id === itemId);
      if (stored) {
        stored.qty = (stored.qty || 1) + qty;
        if (stored.qty > this.storageMaxStack) stored.qty = this.storageMaxStack;
      } else {
        if (this.storage.length >= this.storageMax) return { success: false, reason: "储藏室已满" };
        this.storage.push({ ...item, id: itemId, qty: Math.min(qty, this.storageMaxStack) });
      }

      item.qty = avail - qty;
      if (item.qty <= 0) this.inventory.splice(idx, 1);
    } else {
      if (this.storage.length >= this.storageMax) return { success: false, reason: "储藏室已满" };
      this.storage.push({ ...item, id: itemId, qty: 1 });
      this.inventory.splice(idx, 1);
    }
    this.addLog(`📦 将 ${item.name} x${qty} 存入储藏室`);
    return { success: true };
  }

  withdrawFromStorage(itemId, qty) {
    const idx = this.storage.findIndex(i => i.id === itemId);
    if (idx < 0) return { success: false, reason: "储藏室无此物品" };
    const item = this.storage[idx];
    const isStackable = this._isStackable(item);
    if (!isStackable && qty > 1) qty = 1;

    if (isStackable) {
      const avail = item.qty || 1;
      qty = Math.min(qty, avail);
      if (qty <= 0) return { success: false, reason: "数量不足" };

      const existing = this.inventory.find(i => i.id === itemId && this._isStackable(i));
      if (existing) {
        existing.qty = (existing.qty || 1) + qty;
      } else {
        if (this.inventory.length >= this.getMaxInventory()) return { success: false, reason: "背包已满" };
        this.inventory.push({ ...item, id: itemId, qty: Math.min(qty, 999) });
      }

      item.qty = avail - qty;
      if (item.qty <= 0) this.storage.splice(idx, 1);
    } else {
      if (this.inventory.length >= this.getMaxInventory()) return { success: false, reason: "背包已满" };
      this.inventory.push({ ...item, id: itemId, qty: 1 });
      this.storage.splice(idx, 1);
    }
    this.addLog(`📤 从储藏室取出 ${item.name} x${qty}`);
    return { success: true };
  }

  getStorageByCategory() {
    const cats = { weapon: [], armor: [], consumable: [], skill: [], material: [], other: [] };
    for (const item of this.storage) {
      if (item.type === "equipment" || (item.slot && item.slot !== undefined)) {
        if (item.slot === "weapon") cats.weapon.push(item);
        else cats.armor.push(item);
      } else if (item.type === "consumable") cats.consumable.push(item);
      else if (item.type === "skill_book" || item.type === "scroll" || item.type === "stat_potion") cats.skill.push(item);
      else if (item.type === "material") cats.material.push(item);
      else cats.other.push(item);
    }
    return cats;
  }

  removeItem(itemId, qty) {
    const idx = this.inventory.findIndex(i => i.id === itemId);
    if (idx < 0) return false;
    const stack = this.inventory[idx];
    const currentQty = this._isStackable(stack) ? (stack.qty || 1) : 1;
    qty = qty || currentQty;
    if (qty >= currentQty) {
      this.inventory.splice(idx, 1);
    } else {
      stack.qty -= qty;
    }
    return true;
  }

  // 分离堆叠物品
  splitStack(itemId, qty) {
    qty = parseInt(qty) || 0;
    if (qty <= 0) return false;
    const idx = this.inventory.findIndex(i => i.id === itemId);
    if (idx < 0) return false;
    const stack = this.inventory[idx];
    if (!this._isStackable(stack)) return false;
    const currentQty = stack.qty || 1;
    if (qty >= currentQty) return false;
    if (this.inventory.length >= this.getMaxInventory()) return false;
    stack.qty -= qty;
    const newStack = { ...stack };
    newStack.id = stack.id + "_split_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    newStack.qty = qty;
    if (newStack.effect) newStack.effect = { ...stack.effect };
    this.inventory.push(newStack);
    return true;
  }

  // 获取某物品总数（跨堆叠）
  getItemCount(itemId) {
    let total = 0;
    for (const i of this.inventory) {
      if (i.id === itemId) {
        total += (i.qty || 1);
      }
    }
    return total;
  }

  getMaxInventory() {
    let cap = this.maxInventory;
    const belt = this.equipment.belt;
    if (belt && belt.storage) cap += belt.storage;
    return cap;
  }

  useItem(itemId) {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) return false;

    // 消耗品
    if (item.type === "consumable") {
      const combatStats = this.getCombatStats();
      if (item.effect) {
        if (item.effect.hp) {
          combatStats.hp = Math.min(combatStats.maxHp, combatStats.hp + item.effect.hp);
        }
        if (item.effect.mp) {
          combatStats.mp = Math.min(combatStats.maxMp, combatStats.mp + item.effect.mp);
        }
        if (item.effect.hpPct) {
          combatStats.hp = Math.min(combatStats.maxHp, combatStats.hp + Math.floor(combatStats.maxHp * item.effect.hpPct / 100));
        }
      }
      this.removeItem(itemId, 1);
      this.addLog(`🧪 使用了 ${item.name}。`);
      return { success: true, used: true, stats: combatStats };
    }

    // 属性药水
    if (item.type === "stat_potion") {
      if (item.stat && this.baseStats.hasOwnProperty(item.stat)) {
        this.baseStats[item.stat]++;
        this.removeItem(itemId, 1);
        this.addLog(`🧪 使用了 ${item.name}，${statName(item.stat)}永久+1！`);
        return { success: true, used: true };
      }
      return false;
    }

    // 技能书（指定技能）
    if (item.type === "skill_book") {
      if (item.teaches) {
        const result = this.learnSkill(item.teaches);
        if (result.success) {
          this.removeItem(itemId, 1);
          this.addLog(`📖 研读了 ${item.name}，学会了 ${ALL_SKILLS[item.teaches].name}！`);
          return { success: true, used: true };
        }
        this.addLog(`❌ 无法学习: ${result.reason}`);
        return { success: false, reason: result.reason };
      }
      return false;
    }

    // 随机技能卷轴
    if (item.type === "scroll") {
      const qmap = { skill_scroll_common: "common", skill_scroll_rare: "rare", skill_scroll_epic: "epic" };
      const targetQ = qmap[item.id];
      if (!targetQ) {
        this.addLog(`❌ 无法识别的卷轴: ${item.name}`);
        return false;
      }
      const pool = [];
      for (const [id, def] of Object.entries(ALL_SKILLS)) {
        if (!def.rarity) continue;
        if (targetQ === "common" && def.rarity === "common") pool.push(id);
        if (targetQ === "rare" && (def.rarity === "rare" || def.rarity === "uncommon")) pool.push(id);
        if (targetQ === "epic" && (def.rarity === "epic" || def.rarity === "legendary")) pool.push(id);
      }
      if (pool.length === 0) {
        this.addLog(`❌ 技能池为空，无法从 ${item.name} 中学习技能。`);
        return false;
      }

      // 检查槽位：过滤掉无空槽的技能类型
      const activeFull = this.learnedSkills.active.length >= this.getActiveSkillSlots();
      const passiveFull = this.learnedSkills.passive.length >= this.getMaxPassiveSlots();

      if (activeFull && passiveFull) {
        this.addLog(`❌ 主动技能槽(${this.learnedSkills.active.length}/${this.getActiveSkillSlots()})和被动技能槽(${this.learnedSkills.passive.length}/${this.getMaxPassiveSlots()})均已满，无法记忆新技能。`);
        return false;
      }

      const unlearned = pool.filter(sid => {
        const all = [...this.learnedSkills.active, ...this.learnedSkills.passive];
        return !all.find(s => s.skillId === sid);
      });
      const alreadyAll = unlearned.length === 0;
      let candidates = alreadyAll ? pool : unlearned;

      // 按槽位可用性过滤
      let slotBlocked = false;
      if (activeFull) {
        const before = candidates.length;
        candidates = candidates.filter(sid => {
          const def = ALL_SKILLS[sid];
          return def && def.type !== "active";
        });
        if (candidates.length < before) slotBlocked = true;
      }
      if (passiveFull) {
        const before = candidates.length;
        candidates = candidates.filter(sid => {
          const def = ALL_SKILLS[sid];
          return def && def.type !== "passive";
        });
        if (candidates.length < before) slotBlocked = true;
      }

      if (candidates.length === 0) {
        const fullType = activeFull ? "主动技能槽" : "被动技能槽";
        this.addLog(`❌ ${fullType}已满，卷轴池中无其他类型技能可学。`);
        return false;
      }

      if (slotBlocked && activeFull) {
        this.addLog(`⚠️ 主动技能槽已满(${this.learnedSkills.active.length}/${this.getActiveSkillSlots()})，仅能从被动技能中随机。`);
      } else if (slotBlocked && passiveFull) {
        this.addLog(`⚠️ 被动技能槽已满(${this.learnedSkills.passive.length}/${this.getMaxPassiveSlots()})，仅能从主动技能中随机。`);
      }

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      if (chosen) {
        const result = this.learnSkill(chosen);
        if (result.success) {
          this.removeItem(itemId, 1);
          const tag = alreadyAll ? "（已全学，随机重复学习）" : "";
          this.addLog(`📜 使用了 ${item.name}，学会了 ${ALL_SKILLS[chosen].name}！${tag}`);
          return { success: true, used: true };
        }
        this.addLog(`❌ 无法学习技能: ${result.reason}`);
      } else {
        this.addLog(`❌ 卷轴 ${item.name} 使用失败，未找到可用技能。`);
      }
      return false;
    }

    return false;
  }

  // ===== 日志 =====
  addLog(msg) {
    this.log.push(msg);
    if (this.log.length > 100) this.log.shift();
  }
}

// 辅助函数
function statName(stat) {
  const map = {
    str: "力量", agi: "敏捷", int: "智力", vit: "体力", wis: "智慧", ene: "精力",
    atk: "物理攻击", matk: "魔法攻击", def: "物理防御", mdef: "魔法防御",
    spd: "速度", hp: "HP上限", mp: "MP上限", crit: "暴击率", dodge: "闪避率",
    hpMax: "最大HP", mpMax: "最大MP",
    hpBonus: "HP加成", mpBonus: "MP加成", atkBonus: "攻击加成", matkBonus: "魔法攻击加成",
    defBonus: "防御加成", spdBonus: "速度加成", critBonus: "暴击加成", dodgeBonus: "闪避加成",
    lifeLeech: "生命吸取", thorns: "伤害反弹", hpRegen: "HP恢复",
  };
  return map[stat] || stat;
}
