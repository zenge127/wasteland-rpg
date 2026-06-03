// ===== 敌人数据 =====
// 敌人类型: beast(野兽) / mutant(变异体) / bandit(土匪) / robot(机械) / boss(首领)

const ENEMY_TEMPLATES = {
  // ===== 低级敌人 (1-10级) =====
  "mutant_rat": {
    id: "mutant_rat", name: "变异鼠", lv: 1, type: "mutant",
    stats: { str: 2, agi: 6, int: 1, vit: 2, wis: 1, ene: 2 },
    hpMul: 0.6, dmgMul: 0.5, defMul: 0.3,
    exp: 15, gold: [3, 8],
    skills: [],
    loot: [
      { item: "scrap_metal", chance: 0.3, qty: [1,2] },
      { item: "rat_meat", chance: 0.5, qty: [1,1] }
    ],
    desc: "辐射变异的巨大老鼠，牙齿锋利。"
  },
  "bandit_thug": {
    id: "bandit_thug", name: "废土暴徒", lv: 3, type: "bandit",
    stats: { str: 6, agi: 4, int: 2, vit: 5, wis: 2, ene: 3 },
    hpMul: 1.0, dmgMul: 0.8, defMul: 0.5,
    exp: 30, gold: [8, 20],
    skills: ["heavy_strike"],
    loot: [
      { item: "scrap_metal", chance: 0.4, qty: [1,3] },
      { item: "cloth_armor_scrap", chance: 0.2, qty: [1,1] }
    ],
    desc: "在废土上劫掠幸存者的武装暴徒。"
  },
  "mutant_dog": {
    id: "mutant_dog", name: "变异犬", lv: 5, type: "mutant",
    stats: { str: 8, agi: 10, int: 2, vit: 6, wis: 2, ene: 5 },
    hpMul: 0.8, dmgMul: 0.7, defMul: 0.4,
    exp: 45, gold: [10, 25],
    skills: [],
    loot: [
      { item: "dog_meat", chance: 0.6, qty: [1,2] },
      { item: "bone", chance: 0.3, qty: [1,1] }
    ],
    desc: "野狗在辐射中变得更强壮、更凶残。"
  },
  "scavenger": {
    id: "scavenger", name: "拾荒者", lv: 7, type: "bandit",
    stats: { str: 8, agi: 8, int: 5, vit: 8, wis: 5, ene: 6 },
    hpMul: 1.0, dmgMul: 0.8, defMul: 0.6,
    exp: 60, gold: [15, 35],
    skills: ["power_shot"],
    loot: [
      { item: "scrap_metal", chance: 0.5, qty: [2,4] },
      { item: "water_purifier", chance: 0.15, qty: [1,1] }
    ],
    desc: "在废墟中搜寻有价值物品的独行客，对陌生人充满敌意。"
  },

  // ===== 中级敌人 (11-25级) =====
  "mutant_warrior": {
    id: "mutant_warrior", name: "变异战士", lv: 12, type: "mutant",
    stats: { str: 18, agi: 12, int: 4, vit: 15, wis: 4, ene: 10 },
    hpMul: 1.5, dmgMul: 1.2, defMul: 0.8,
    exp: 120, gold: [30, 60],
    skills: ["whirlwind"],
    loot: [
      { item: "mutant_gland", chance: 0.3, qty: [1,1] },
      { item: "steel_ingot", chance: 0.2, qty: [1,2] }
    ],
    desc: "高度变异的类人生物，肌肉膨胀，力大无穷。"
  },
  "bandit_leader": {
    id: "bandit_leader", name: "土匪头目", lv: 15, type: "bandit",
    stats: { str: 22, agi: 16, int: 8, vit: 18, wis: 8, ene: 14 },
    hpMul: 1.3, dmgMul: 1.3, defMul: 0.9,
    exp: 200, gold: [50, 100],
    skills: ["heavy_strike", "shield_bash"],
    loot: [
      { item: "gold_coin", chance: 0.5, qty: [10, 30] },
      { item: "weapon_part", chance: 0.25, qty: [1,2] },
      { item: "skill_scroll_common", chance: 0.1, qty: [1,1] }
    ],
    desc: "统领一群暴徒的小头目，装备精良。"
  },
  "glowing_ghoul": {
    id: "glowing_ghoul", name: "发光的食尸鬼", lv: 18, type: "mutant",
    stats: { str: 20, agi: 20, int: 6, vit: 18, wis: 6, ene: 16 },
    hpMul: 1.4, dmgMul: 1.2, defMul: 0.7,
    exp: 250, gold: [40, 80],
    skills: ["soul_drain"],
    loot: [
      { item: "radiated_core", chance: 0.3, qty: [1,1] },
      { item: "dark_essence", chance: 0.2, qty: [1,1] }
    ],
    desc: "长期辐射下变异的食尸生物，身体散发着诡异的绿光。"
  },
  "security_bot": {
    id: "security_bot", name: "安全机器人", lv: 16, type: "robot",
    stats: { str: 24, agi: 8, int: 2, vit: 25, wis: 2, ene: 2 },
    hpMul: 2.0, dmgMul: 1.1, defMul: 1.2,
    exp: 220, gold: [0, 0],
    skills: [],
    loot: [
      { item: "scrap_metal", chance: 0.7, qty: [3,6] },
      { item: "circuit_board", chance: 0.4, qty: [1,2] },
      { item: "energy_cell", chance: 0.2, qty: [1,1] }
    ],
    desc: "末日前的安保机器人，至今仍在执行巡逻指令。"
  },

  // ===== 高级敌人 (26-50级) =====
  "deathclaw": {
    id: "deathclaw", name: "死亡爪", lv: 25, type: "mutant",
    stats: { str: 40, agi: 30, int: 5, vit: 35, wis: 5, ene: 25 },
    hpMul: 2.5, dmgMul: 2.0, defMul: 1.3,
    exp: 500, gold: [80, 150],
    skills: ["execute"],
    loot: [
      { item: "deathclaw_claw", chance: 0.5, qty: [1,2] },
      { item: "mutant_gland", chance: 0.4, qty: [2,3] }
    ],
    desc: "废土上最可怕的掠食者之一，巨大的变异爬行动物。"
  },
  "wasteland_mage": {
    id: "wasteland_mage", name: "废土法师", lv: 22, type: "bandit",
    stats: { str: 8, agi: 16, int: 45, vit: 22, wis: 40, ene: 20 },
    hpMul: 1.0, dmgMul: 1.8, defMul: 0.6,
    exp: 400, gold: [60, 120],
    skills: ["fireball", "ice_spike", "lightning"],
    loot: [
      { item: "magic_crystal", chance: 0.4, qty: [1,3] },
      { item: "skill_scroll_rare", chance: 0.15, qty: [1,1] }
    ],
    desc: "掌握了残存魔法知识的流浪法师，危险而神秘。"
  },
  "assault_mech": {
    id: "assault_mech", name: "突击机甲", lv: 30, type: "robot",
    stats: { str: 50, agi: 15, int: 2, vit: 50, wis: 2, ene: 2 },
    hpMul: 3.0, dmgMul: 2.2, defMul: 1.8,
    exp: 700, gold: [0, 0],
    skills: ["grenade", "turret"],
    loot: [
      { item: "steel_ingot", chance: 0.6, qty: [3,8] },
      { item: "circuit_board", chance: 0.5, qty: [2,4] },
      { item: "energy_cell", chance: 0.3, qty: [2,3] },
      { item: "tech_part", chance: 0.2, qty: [1,2] }
    ],
    desc: "战前军用机甲，火力强大，装甲厚重。"
  },
  "toxic_shaman": {
    id: "toxic_shaman", name: "毒雾萨满", lv: 28, type: "mutant",
    stats: { str: 15, agi: 20, int: 50, vit: 30, wis: 45, ene: 28 },
    hpMul: 1.3, dmgMul: 1.6, defMul: 0.8,
    exp: 600, gold: [70, 140],
    skills: ["dark_bolt", "soul_drain"],
    loot: [
      { item: "dark_essence", chance: 0.5, qty: [2,4] },
      { item: "magic_crystal", chance: 0.3, qty: [2,5] },
      { item: "skill_scroll_epic", chance: 0.1, qty: [1,1] }
    ],
    desc: "崇拜辐射的变异萨满，能够操控暗影和毒素。"
  },

  // ===== BOSS级敌人 =====
  "wasteland_dragon": {
    id: "wasteland_dragon", name: "废土巨龙", lv: 50, type: "boss",
    stats: { str: 80, agi: 40, int: 30, vit: 70, wis: 30, ene: 50 },
    hpMul: 8.0, dmgMul: 3.5, defMul: 2.5,
    exp: 5000, gold: [500, 1000],
    skills: ["fireball", "meteor", "execute"],
    loot: [
      { item: "dragon_scale", chance: 0.8, qty: [3,5] },
      { item: "dragon_heart", chance: 0.3, qty: [1,1] },
      { item: "legendary_weapon", chance: 0.1, qty: [1,1] }
    ],
    desc: "核辐射中诞生的巨型变异蜥蜴，废土上最强大的生物之一。",
    isBoss: true
  },
  "ancient_ai": {
    id: "ancient_ai", name: "古代AI·奥米伽", lv: 60, type: "boss",
    stats: { str: 30, agi: 50, int: 100, vit: 80, wis: 80, ene: 60 },
    hpMul: 6.0, dmgMul: 3.0, defMul: 2.0,
    exp: 8000, gold: [0, 0],
    skills: ["EMP", "turret", "lightning", "dark_bolt"],
    loot: [
      { item: "ai_core", chance: 0.5, qty: [1,1] },
      { item: "tech_part", chance: 0.8, qty: [5,10] },
      { item: "energy_cell", chance: 0.8, qty: [5,10] },
      { item: "legendary_armor", chance: 0.1, qty: [1,1] }
    ],
    desc: "末日前的超级AI，至今仍控制着一座地下基地。",
    isBoss: true
  },
  "leviathan": {
    id: "leviathan", name: "深海利维坦", lv: 70, type: "boss",
    stats: { str: 90, agi: 30, int: 40, vit: 100, wis: 40, ene: 50 },
    hpMul: 10.0, dmgMul: 4.0, defMul: 3.0,
    exp: 15000, gold: [1000, 3000],
    skills: ["ice_spike", "soul_drain", "meteor"],
    loot: [
      { item: "leviathan_scale", chance: 0.8, qty: [5,10] },
      { item: "ocean_core", chance: 0.4, qty: [1,2] },
      { item: "mythic_trident", chance: 0.05, qty: [1,1] }
    ],
    desc: "深海中因辐射变异的巨型海兽，海洋探险者的噩梦。",
    isBoss: true
  },
};

// 根据等级选择敌人
function getEnemiesForLevel(playerLv) {
  const available = [];
  for (const key in ENEMY_TEMPLATES) {
    const e = ENEMY_TEMPLATES[key];
    const diff = Math.abs(e.lv - playerLv);
    if (diff <= 8 && !e.isBoss) available.push(e);
  }
  if (available.length === 0) {
    // fallback: find closest
    let closest = ENEMY_TEMPLATES["mutant_rat"];
    for (const key in ENEMY_TEMPLATES) {
      if (!ENEMY_TEMPLATES[key].isBoss && Math.abs(ENEMY_TEMPLATES[key].lv - playerLv) < Math.abs(closest.lv - playerLv)) {
        closest = ENEMY_TEMPLATES[key];
      }
    }
    available.push(closest);
  }
  return available;
}

function getBossEnemies(playerLv) {
  const bosses = [];
  for (const key in ENEMY_TEMPLATES) {
    if (ENEMY_TEMPLATES[key].isBoss && ENEMY_TEMPLATES[key].lv <= playerLv + 5) {
      bosses.push(ENEMY_TEMPLATES[key]);
    }
  }
  return bosses;
}

// 从模板生成实际敌人实例 (带等级浮动)
function spawnEnemy(template) {
  const lvVar = Math.floor(Math.random() * 5) - 2; // -2 ~ +2
  const lv = Math.max(1, template.lv + lvVar);
  const scale = 1 + (lv - template.lv) * 0.08;
  const baseStats = {};
  for (const s in template.stats) {
    baseStats[s] = Math.floor(template.stats[s] * scale);
  }
  const hp = Math.floor((20 + baseStats.vit * 8) * template.hpMul);
  const mp = Math.floor((10 + baseStats.wis * 4) * 0.5);
  const atk = Math.floor((3 + baseStats.str * 1.5) * template.dmgMul);
  const matk = Math.floor((2 + baseStats.int * 1.5) * template.dmgMul);
  const def = Math.floor((1 + baseStats.vit * 0.8) * template.defMul);
  const mdef = Math.floor((1 + baseStats.wis * 0.8) * template.defMul);
  return {
    ...template,
    lv,
    baseStats,
    hp, maxHp: hp,
    mp, maxMp: mp,
    atk, matk, def, mdef,
    spd: baseStats.agi * 1.5 + 5,
    dodge: Math.min(30, baseStats.agi * 0.8),
    crit: Math.min(40, baseStats.ene * 1.2),
    exp: Math.floor(template.exp * scale),
    gold: [Math.floor(template.gold[0] * scale), Math.floor(template.gold[1] * scale)],
  };
}
