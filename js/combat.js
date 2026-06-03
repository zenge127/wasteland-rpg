// ===== 回合制战斗系统 =====

class CombatSystem {
  constructor(player) {
    this.player = player;
    this.enemy = null;
    this.active = false;
    this.turn = "player"; // "player" | "enemy"
    this.turnCount = 0;
    this.combatLog = [];
    this.autoMode = false;
    this.autoTimer = null;

    // 战斗中的临时状态
    this.playerBuffs = [];   // [{ type, turns, value }]
    this.enemyBuffs = [];
    this.playerDefending = false;
    this.enemyDefending = false;
    this.playerHp = 0;
    this.playerMp = 0;
    this.playerMaxHp = 0;
    this.playerMaxMp = 0;
    this.turretActive = 0;   // 炮台剩余回合
    this.skillCooldowns = {}; // { skillId: remainingTurns } 技能冷却追踪
    this.onUpdate = null;    // UI更新回调
    this.onBattleResult = null; // 战斗结算回调
  }

  startBattle(enemy) {
    this.enemy = spawnEnemy(enemy);
    const ps = this.player.getCombatStats();
    this.playerHp = ps.maxHp;
    this.playerMaxHp = ps.maxHp;
    this.playerMp = ps.maxMp;
    this.playerMaxMp = ps.maxMp;
    this.active = true;
    this.turn = "player";
    this.turnCount = 0;
    this.combatLog = [`⚔️ 遭遇了 ${this.enemy.name} (Lv.${this.enemy.lv})！`];
    this.playerBuffs = [];
    this.enemyBuffs = [];
    this.playerDefending = false;
    this.enemyDefending = false;
    this.turretActive = 0;
    this.skillCooldowns = {};
    this.autoMode = false;
    if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
    this.updateUI();
    // 恐惧光环
    this.applyPassiveDebuffs();
  }

  applyPassiveDebuffs() {
    for (const sk of this.player.learnedSkills.passive) {
      if (sk.skillId === "fear_presence") {
        if (Math.random() < 0.2) {
          this.enemyBuffs.push({ type: "fear", turns: 1, value: 0 });
          this.addLog(`👻 恐惧光环触发！${this.enemy.name} 被恐惧了！`);
        }
      }
    }
  }

  addLog(msg) {
    this.combatLog.push(msg);
    if (this.combatLog.length > 50) this.combatLog.shift();
  }

  // ===== 玩家行动 =====
  playerAttack() {
    if (!this.active || this.turn !== "player") return;

    const ps = this.player.getCombatStats();
    let dmg = ps.atk;
    let isCrit = false;
    let isDodge = false;

    // 检查敌人闪避
    if (Math.random() * 100 < this.enemy.dodge) {
      isDodge = true;
      this.addLog(`💨 ${this.enemy.name} 闪避了攻击！`);
    } else {
      // 暴击判定
      if (Math.random() * 100 < ps.crit) {
        dmg = Math.floor(dmg * 1.8);
        isCrit = true;
      }
      // 伤害计算
      dmg = Math.max(1, dmg - this.enemy.def);
      // 防御姿态减伤
      if (this.enemyDefending) dmg = Math.floor(dmg * 0.5);
      // 伤害浮动
      dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));

      this.enemy.hp -= dmg;
      let logMsg = `⚔️ 你攻击了 ${this.enemy.name}，造成 ${dmg} 点伤害`;
      if (isCrit) logMsg += "（暴击！）";
      this.addLog(logMsg);
      // 战斗特效
      if (window.gameInstance && window.gameInstance.ui) {
        window.gameInstance.ui.playAttackEffect("player");
        window.gameInstance.ui.playHitEffect("enemy");
        window.gameInstance.ui.showDamageNumber("enemy", dmg, isCrit, false);
      }

      // 枯萎之触
      this.applyWitheringTouch();
    }

    this.playerDefending = false;
    if (this.enemy.hp > 0) this.endPlayerTurn();
    else this.checkBattleEnd();
  }

  playerUseSkill(skillId) {
    if (!this.active || this.turn !== "player") return;

    const skill = this.player.learnedSkills.active.find(s => s.skillId === skillId);
    if (!skill) return;

    const def = ALL_SKILLS[skillId];
    if (!def) return;

    // 检查MP
    if (this.playerMp < def.mpCost) {
      this.addLog(`❌ MP不足！需要 ${def.mpCost} MP`);
      return;
    }

    // 检查冷却
    const cdLeft = this.skillCooldowns[skillId] || 0;
    if (cdLeft > 0) {
      this.addLog(`⏳ 【${def.name}】冷却中，剩余 ${cdLeft} 回合`);
      return;
    }

    this.playerMp -= def.mpCost;
    // 设置冷却
    if (def.cooldown > 0) {
      this.skillCooldowns[skillId] = def.cooldown;
    }
    const ps = this.player.getCombatStats();

    if (def.target === "self") {
      // 自我技能
      if (skillId === "heal") {
        const heal = Math.floor(this.playerMaxHp * 0.25);
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + heal);
        this.addLog(`💚 治愈术恢复了 ${heal} 点HP！`);
      } else if (skillId === "med_kit") {
        const heal = Math.floor(this.playerMaxHp * 0.35);
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + heal);
        this.playerBuffs = []; // 移除负面状态
        this.addLog(`🏥 医疗包恢复了 ${heal} 点HP，并移除了负面状态！`);
      }
    } else {
      // 攻击技能
      let baseDmg;
      if (def.element === "physical") {
        baseDmg = Math.floor(ps.atk * def.power / 100);
      } else {
        baseDmg = Math.floor(ps.matk * def.power / 100);
      }

      // 处决判定
      if (skillId === "execute" && this.enemy.hp / this.enemy.maxHp > 0.3) {
        baseDmg = Math.floor(baseDmg * 0.5);
        this.addLog("⚠️ 处决未触发条件，伤害减半。");
      }

      // EMP对机械加成
      if (skillId === "EMP" && this.enemy.type === "robot") {
        baseDmg = Math.floor(baseDmg * 2);
      }

      let dmg = Math.max(1, baseDmg - (def.element === "physical" ? this.enemy.def : this.enemy.mdef));
      let isCrit = false;
      if (Math.random() * 100 < (ps.crit + (skillId === "sneak_attack" ? 30 : 0))) {
        dmg = Math.floor(dmg * 1.8);
        isCrit = true;
      }
      dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));

      this.enemy.hp -= dmg;
      let logMsg = `✨ 你使用了【${def.name}】${isCrit ? "（暴击！）" : ""}，造成 ${dmg} 点伤害`;
      this.addLog(logMsg);
      if (window.gameInstance && window.gameInstance.ui) {
        window.gameInstance.ui.showMagicEffect("enemy");
        window.gameInstance.ui.playHitEffect("enemy");
        window.gameInstance.ui.showDamageNumber("enemy", dmg, isCrit, false);
      }

      // 特殊效果
      if (skillId === "whirlwind" && Math.random() < 0.2) {
        this.enemyBuffs.push({ type: "bleed", turns: 3, value: Math.floor(dmg * 0.1) });
        this.addLog("🩸 敌人流血了！");
      }
      if (skillId === "shield_bash") {
        this.enemyBuffs.push({ type: "stun", turns: 1, value: 0 });
        this.addLog("💫 敌人被眩晕了！");
      }
      if (skillId === "ice_spike") {
        this.enemyBuffs.push({ type: "slow", turns: 1, value: 0 });
      }
      if (skillId === "lightning" && Math.random() < 0.3) {
        this.enemyBuffs.push({ type: "paralyze", turns: 1, value: 0 });
        this.addLog("⚡ 敌人被麻痹了！");
      }
      if (skillId === "fireball" && Math.random() < 0.2) {
        this.enemyBuffs.push({ type: "burn", turns: 3, value: Math.floor(dmg * 0.08) });
      }
      if (skillId === "turret") {
        this.turretActive = 3;
        this.addLog("🔫 部署了自动炮台，持续3回合！");
      }

      // 枯萎之触
      this.applyWitheringTouch();
    }

    this.playerDefending = false;
    if (this.enemy.hp > 0) this.endPlayerTurn();
    else this.checkBattleEnd();
  }

  applyWitheringTouch() {
    const hasWithering = this.player.learnedSkills.passive.find(s => s.skillId === "withering_touch");
    if (hasWithering && Math.random() < 0.15) {
      this.enemyBuffs.push({ type: "atk_down", turns: 2, value: 10 });
      this.addLog("🌿 枯萎之触发动！敌人攻击力降低10%。");
    }
  }

  playerDefend() {
    if (!this.active || this.turn !== "player") return;
    this.playerDefending = true;
    this.addLog("🛡️ 你进入防御姿态，受到的伤害减半。");
    this.endPlayerTurn();
  }

  playerFlee() {
    if (!this.active || this.turn !== "player") return;
    const fleeChance = 40 + this.player.getCombatStats().spd * 0.5 - this.enemy.spd * 0.3;
    if (Math.random() * 100 < fleeChance) {
      this.addLog("🏃 你成功逃跑了！");
      this.endBattle();
    } else {
      this.addLog("❌ 逃跑失败！");
      this.endPlayerTurn();
    }
  }

  playerUseItem(itemId) {
    if (!this.active || this.turn !== "player") return;
    const item = this.player.inventory.find(i => i.id === itemId);
    if (!item || item.type !== "consumable") {
      this.addLog("❌ 无法使用该物品。");
      return;
    }

    if (item.effect) {
      if (item.effect.hp) {
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + item.effect.hp);
        this.addLog(`🧪 使用 ${item.name}，恢复了 ${item.effect.hp} HP。`);
      }
      if (item.effect.mp) {
        this.playerMp = Math.min(this.playerMaxMp, this.playerMp + item.effect.mp);
        this.addLog(`🧪 使用 ${item.name}，恢复了 ${item.effect.mp} MP。`);
      }
      if (item.effect.hpPct) {
        const heal = Math.floor(this.playerMaxHp * item.effect.hpPct / 100);
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + heal);
        this.addLog(`🧪 使用 ${item.name}，恢复了 ${heal} HP。`);
      }
      if (item.effect.curePoison) {
        this.playerBuffs = this.playerBuffs.filter(b => b.type !== "poison");
        this.addLog("🧪 使用解毒剂，中毒状态已解除。");
      }
      if (item.effect.atkBuff) {
        this.playerBuffs.push({ type: "atk_up", turns: item.effect.buffTurns, value: item.effect.atkBuff });
        this.addLog(`💪 使用 ${item.name}，攻击力+${item.effect.atkBuff}%！`);
      }
    }
    this.player.removeItem(itemId);
    this.endPlayerTurn();
  }

  endPlayerTurn() {
    this.turn = "enemy";
    this.turnCount++;
    // 减少技能冷却
    for (const key in this.skillCooldowns) {
      if (this.skillCooldowns[key] > 0) this.skillCooldowns[key]--;
      if (this.skillCooldowns[key] <= 0) delete this.skillCooldowns[key];
    }
    this.processBuffs("player");
    this.processTurret();
    this.checkBattleEnd();
    if (this.active) {
      setTimeout(() => this.enemyTurn(), 800);
    }
  }

  // ===== 敌人行动 =====
  enemyTurn() {
    if (!this.active) return;

    // 处理敌人buff（眩晕/麻痹/恐惧跳过回合）
    const stun = this.enemyBuffs.find(b => b.type === "stun" || b.type === "paralyze" || b.type === "fear");
    if (stun) {
      this.addLog(`💫 ${this.enemy.name} 无法行动！`);
      this.processBuffs("enemy");
      this.endEnemyTurn();
      return;
    }

    // 减速判定：50%跳过
    const slow = this.enemyBuffs.find(b => b.type === "slow");
    if (slow && Math.random() < 0.5) {
      this.addLog(`❄️ ${this.enemy.name} 因减速而无法行动！`);
      this.processBuffs("enemy");
      this.endEnemyTurn();
      return;
    }

    // 敌人AI：50%概率使用技能
    if (this.enemy.skills.length > 0 && Math.random() < 0.4) {
      const skillId = this.enemy.skills[Math.floor(Math.random() * this.enemy.skills.length)];
      const skillDef = ALL_SKILLS[skillId];
      if (skillDef && this.enemy.mp >= skillDef.mpCost) {
        this.enemy.mp -= skillDef.mpCost;
        this.enemyUseSkill(skillDef);
      } else {
        this.enemyBasicAttack();
      }
    } else {
      this.enemyBasicAttack();
    }

    this.enemyDefending = Math.random() < 0.1; // 10%概率防御
    this.processBuffs("enemy");
    this.endEnemyTurn();
  }

  enemyBasicAttack() {
    const dodge = this.playerDefending ? this.player.getCombatStats().dodge * 2 : this.player.getCombatStats().dodge;
    if (Math.random() * 100 < dodge) {
      this.addLog("💨 你闪避了攻击！");
      return;
    }

    let dmg = this.enemy.atk;
    let isCrit = false;
    const atkUp = this.enemyBuffs.find(b => b.type === "atk_up");
    if (atkUp) dmg = Math.floor(dmg * (1 + atkUp.value / 100));
    const atkDown = this.enemyBuffs.find(b => b.type === "atk_down");
    if (atkDown) dmg = Math.floor(dmg * (1 - atkDown.value / 100));

    if (Math.random() * 100 < this.enemy.crit) {
      dmg = Math.floor(dmg * 1.8);
      isCrit = true;
      this.addLog("💥 敌人暴击！");
    }

    let playerDef = this.player.getCombatStats().def;
    if (this.playerDefending) playerDef = Math.floor(playerDef * 2);

    dmg = Math.max(1, dmg - playerDef);
    dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));

    this.playerHp -= dmg;
    this.addLog(`👊 ${this.enemy.name} 攻击了你，造成 ${dmg} 点伤害。`);
    if (window.gameInstance && window.gameInstance.ui) {
      window.gameInstance.ui.playAttackEffect("enemy");
      window.gameInstance.ui.playHitEffect("player");
      window.gameInstance.ui.showDamageNumber("player", dmg, isCrit, false);
    }
  }

  enemyUseSkill(skillDef) {
    if (skillDef.target === "self") {
      if (skillDef.id === "heal") {
        const heal = Math.floor(this.enemy.maxHp * 0.2);
        this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + heal);
        this.addLog(`💚 ${this.enemy.name} 使用了【${skillDef.name}】，恢复了 ${heal} HP。`);
      }
      return;
    }

    let baseDmg;
    if (skillDef.element === "physical") {
      baseDmg = Math.floor(this.enemy.atk * skillDef.power / 100);
    } else {
      baseDmg = Math.floor(this.enemy.matk * skillDef.power / 100);
    }

    const playerDef = skillDef.element === "physical" ? this.player.getCombatStats().def : this.player.getCombatStats().mdef;
    let dmg = Math.max(1, baseDmg - playerDef);
    dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));

    if (this.playerDefending) dmg = Math.floor(dmg * 0.5);

    this.playerHp -= dmg;
    this.addLog(`💥 ${this.enemy.name} 使用了【${skillDef.name}】，造成 ${dmg} 点伤害。`);

    // 敌人技能特效
    if (skillDef.id === "shield_bash") {
      this.playerBuffs.push({ type: "stun", turns: 1, value: 0 });
    }
    if (skillDef.id === "ice_spike") {
      this.playerBuffs.push({ type: "slow", turns: 2, value: 0 });
    }
    if (skillDef.id === "soul_drain") {
      const heal = Math.floor(dmg * 0.5);
      this.enemy.hp = Math.min(this.enemy.maxHp, this.enemy.hp + heal);
    }
    if (skillDef.id === "meteor") {
      this.playerBuffs.push({ type: "burn", turns: 3, value: Math.floor(dmg * 0.1) });
    }
  }

  processBuffs(side) {
    const buffs = side === "player" ? this.playerBuffs : this.enemyBuffs;
    const hpRef = side === "player" ? { get: () => this.playerHp, set: (v) => { this.playerHp = v; } }
                                     : { get: () => this.enemy.hp, set: (v) => { this.enemy.hp = v; } };

    for (let i = buffs.length - 1; i >= 0; i--) {
      const buff = buffs[i];
      buff.turns--;
      if (buff.type === "bleed" || buff.type === "burn" || buff.type === "poison") {
        const dotDmg = buff.value || 5;
        hpRef.set(hpRef.get() - dotDmg);
        if (side === "player") this.addLog(`🩸 你受到 ${dotDmg} 点持续伤害。`);
        else this.addLog(`🩸 ${this.enemy.name} 受到 ${dotDmg} 点持续伤害。`);
      }
      if (buff.turns <= 0) buffs.splice(i, 1);
    }
  }

  processTurret() {
    if (this.turretActive > 0) {
      const turretDmg = Math.floor(this.player.getCombatStats().atk * 0.8);
      const dmg = Math.max(1, turretDmg - this.enemy.def);
      this.enemy.hp -= dmg;
      this.turretActive--;
      this.addLog(`🔫 炮台射击，造成 ${dmg} 点伤害！（剩余 ${this.turretActive} 回合）`);
    }
  }

  endEnemyTurn() {
    this.turn = "player";
    this.playerDefending = false;
    this.checkBattleEnd();
    this.updateUI();
    if (this.active && this.autoMode) {
      this.autoTimer = setTimeout(() => this.autoAction(), 1000);
    }
  }

  // ===== 自动战斗 =====
  toggleAuto() {
    this.autoMode = !this.autoMode;
    if (this.autoMode) {
      this.addLog("🤖 自动战斗模式开启。");
      this.autoTimer = setTimeout(() => this.autoAction(), 1000);
    } else {
      this.addLog("🤖 自动战斗模式关闭。");
      if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
    }
    this.updateUI();
  }

  autoAction() {
    if (!this.active || !this.autoMode || this.turn !== "player") return;

    // 自动AI: 低血量优先治疗/吃药
    if (this.playerHp < this.playerMaxHp * 0.3) {
      // 尝试使用治疗技能
      const healSkill = this.player.learnedSkills.active.find(s =>
        (s.skillId === "heal" || s.skillId === "med_kit") && this.playerMp >= ALL_SKILLS[s.skillId].mpCost
      );
      if (healSkill) {
        this.playerUseSkill(healSkill.skillId);
        return;
      }
      // 尝试使用药水
      const potion = this.player.inventory.find(i =>
        i.type === "consumable" && (i.effect.hp || i.effect.hpPct)
      );
      if (potion) {
        this.playerUseItem(potion.id);
        return;
      }
    }

    // 使用技能或普通攻击
    if (this.player.learnedSkills.active.length > 0 && Math.random() < 0.6) {
      const usableSkills = this.player.learnedSkills.active.filter(s => {
        const def = ALL_SKILLS[s.skillId];
        return def && this.playerMp >= def.mpCost && def.target === "enemy";
      });
      if (usableSkills.length > 0) {
        const skill = usableSkills[Math.floor(Math.random() * usableSkills.length)];
        this.playerUseSkill(skill.skillId);
        return;
      }
    }

    this.playerAttack();
    this.updateUI();
  }

  // ===== 战斗结算 =====
  checkBattleEnd() {
    if (this.playerHp <= 0) {
      this.playerHp = 0;
      this.addLog("💀 你被击败了...");
      this.endBattle();
      const lostGold = Math.floor(this.player.gold * 0.2);
      setTimeout(() => {
        const ps = this.player.getCombatStats();
        this.playerHp = Math.floor(ps.maxHp * 0.3);
        this.playerMp = Math.floor(ps.maxMp * 0.3);
        this.player.gold -= lostGold;
        this.player.addLog("💀 战斗失败！失去了20%的金币，在附近重生。");
        if (this.onBattleResult) this.onBattleResult({ won: false, exp: 0, gold: 0, goldLost: lostGold, items: [], enemy: this.enemy });
        if (this.onLose) this.onLose();
      }, 1500);
      return;
    }

    if (this.enemy.hp <= 0) {
      this.enemy.hp = 0;
      // 生成掉落金币
      const [minGold, maxGold] = this.enemy.gold;
      const goldDrop = Math.floor(Math.random() * (maxGold - minGold + 1)) + minGold;
      this.player.gold += goldDrop;

      // 给予经验
      this.player.gainExp(this.enemy.exp);

      // 掉落物品
      const droppedItems = [];
      if (this.enemy.loot) {
        for (const loot of this.enemy.loot) {
          if (Math.random() < loot.chance) {
            const qty = Array.isArray(loot.qty) ?
              Math.floor(Math.random() * (loot.qty[1] - loot.qty[0] + 1)) + loot.qty[0] : loot.qty;
            const itemDef = ALL_ITEMS[loot.item];
            if (itemDef) {
              const isStackable = this.player._isStackable(itemDef);
              if (isStackable) {
                const newItem = { ...itemDef, id: loot.item };
                if (this.player.addItem(newItem, qty)) {
                  droppedItems.push(newItem.name + (qty > 1 ? " x" + qty : ""));
                }
              } else {
                for (let i = 0; i < qty; i++) {
                  const newItem = { ...itemDef, id: loot.item + "_" + Date.now() + "_" + i + Math.floor(Math.random() * 1000) };
                  if (this.player.addItem(newItem)) {
                    droppedItems.push(newItem.name);
                  }
                }
              }
            }
          }
        }
      }

      // 掉落装备（概率）
      if (Math.random() < 0.25) {
        const equipPool = Object.values(WEAPON_BASE).filter(e => Math.abs(e.minLv - this.player.lv) <= 5);
        const armorPool = Object.values(ARMOR_BASE).filter(e => Math.abs(e.minLv - this.player.lv) <= 5);
        const pool = [...equipPool, ...armorPool];
        if (pool.length > 0) {
          const base = pool[Math.floor(Math.random() * pool.length)];
          const quality = randomQuality(this.player.lv);
          const eq = generateEquipItem(base, quality, this.player.lv);
          if (eq && this.player.addItem(eq)) {
            droppedItems.push(`${eq.name} [${eq.qualityName}]`);
          }
        }
      }

      this.addLog(`🎉 战斗胜利！获得 ${this.enemy.exp} 经验，${goldDrop} 金币。`);
      if (droppedItems.length > 0) {
        this.addLog(`📦 掉落物品: ${droppedItems.join(", ")}`);
      }

      // 任务进度
      if (this.onQuestUpdate) {
        this.onQuestUpdate("kill", this.enemy.id);
        this.onQuestUpdate("kill", null);
      }

      this.endBattle();
      if (this.onBattleResult) this.onBattleResult({ won: true, exp: this.enemy.exp, gold: goldDrop, goldLost: 0, items: droppedItems, enemy: this.enemy });
      if (this.onWin) this.onWin({ exp: this.enemy.exp, gold: goldDrop, items: droppedItems });
      return;
    }
  }

  endBattle() {
    this.active = false;
    this.autoMode = false;
    if (this.autoTimer) { clearTimeout(this.autoTimer); this.autoTimer = null; }
    this.updateUI();
  }

  // ===== 获取当前状态 =====
  getState() {
    const ps = this.player.getCombatStats();
    return {
      active: this.active,
      player: {
        name: this.player.name,
        hp: this.playerHp,
        maxHp: this.playerMaxHp,
        mp: this.playerMp,
        maxMp: this.playerMaxMp,
        atk: ps.atk,
        matk: ps.matk,
        def: ps.def,
        mdef: ps.mdef,
        spd: ps.spd,
        crit: ps.crit,
      },
      enemy: this.enemy ? {
        name: this.enemy.name,
        lv: this.enemy.lv,
        hp: this.enemy.hp,
        maxHp: this.enemy.maxHp,
        mp: this.enemy.mp,
        maxMp: this.enemy.maxMp,
      } : null,
      turn: this.turn,
      autoMode: this.autoMode,
      log: this.combatLog,
    };
  }

  updateUI() {
    if (this.onUpdate) this.onUpdate(this.getState());
  }
}
