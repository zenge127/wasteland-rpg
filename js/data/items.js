// ===== 物品数据 =====
// 品质: white(普通) / blue(精良) / purple(优秀) / yellow(完美) / gold(传说) / black(神话)
// 装备槽位: weapon / head / body / belt / pants / shoes / ring / necklace / amulet
// 武器类型: one_hand / two_hand / dual / ranged / magic

const QUALITY_COLORS = {
  white: { name: "普通", color: "#c0c0c0", mul: 1.0, prefix: "" },
  blue: { name: "精良", color: "#4080ff", mul: 1.3, prefix: "精良的" },
  purple: { name: "优秀", color: "#a040ff", mul: 1.6, prefix: "优秀的" },
  yellow: { name: "完美", color: "#ffc040", mul: 2.0, prefix: "完美的" },
  gold: { name: "传说", color: "#ff8c00", mul: 2.5, prefix: "传说的" },
  black: { name: "神话", color: "#ff4040", mul: 3.2, prefix: "神话的" },
};

const EQUIP_SLOT_NAMES = {
  weapon: "武器", head: "头部", body: "身体", belt: "腰带",
  pants: "裤子", shoes: "鞋子", ring: "戒指", necklace: "项链", amulet: "护身符"
};

const WEAPON_TYPES = {
  one_hand: { name: "单手", slots: ["weapon"], statMul: 1.0 },
  two_hand: { name: "双手", slots: ["weapon"], statMul: 1.5, twoHanded: true },
  dual: { name: "双持", slots: ["weapon"], statMul: 0.7, dualWield: true },
  ranged: { name: "远程", slots: ["weapon"], statMul: 0.9 },
  magic: { name: "魔法", slots: ["weapon"], statMul: 1.1, magicFocus: true },
};

// 武器基础模板
const WEAPON_BASE = {
  // 单手武器
  "rusty_sword": { id: "rusty_sword", name: "锈蚀短剑", type: "one_hand", slot: "weapon",
    baseStats: { atk: 5, spd: 2 }, minLv: 1, buyPrice: 50, sellPrice: 10 },
  "combat_knife": { id: "combat_knife", name: "战斗匕首", type: "one_hand", slot: "weapon",
    baseStats: { atk: 4, spd: 4, crit: 3 }, minLv: 3, buyPrice: 80, sellPrice: 16 },
  "steel_sword": { id: "steel_sword", name: "精钢长剑", type: "one_hand", slot: "weapon",
    baseStats: { atk: 10, spd: 3 }, minLv: 8, buyPrice: 200, sellPrice: 40 },
  "vibro_blade": { id: "vibro_blade", name: "振动刃", type: "one_hand", slot: "weapon",
    baseStats: { atk: 16, spd: 5 }, minLv: 15, buyPrice: 500, sellPrice: 100 },
  "plasma_cutter": { id: "plasma_cutter", name: "等离子切割剑", type: "one_hand", slot: "weapon",
    baseStats: { atk: 25, spd: 6 }, minLv: 25, buyPrice: 1500, sellPrice: 300 },

  // 双手武器
  "sledgehammer": { id: "sledgehammer", name: "大锤", type: "two_hand", slot: "weapon",
    baseStats: { atk: 12, crit: 5 }, minLv: 3, buyPrice: 100, sellPrice: 20 },
  "great_axe": { id: "great_axe", name: "巨斧", type: "two_hand", slot: "weapon",
    baseStats: { atk: 20, crit: 8 }, minLv: 10, buyPrice: 400, sellPrice: 80 },
  "warhammer": { id: "warhammer", name: "战锤", type: "two_hand", slot: "weapon",
    baseStats: { atk: 30, crit: 10, def: 5 }, minLv: 20, buyPrice: 1200, sellPrice: 240 },
  "chainsaw_sword": { id: "chainsaw_sword", name: "链锯大剑", type: "two_hand", slot: "weapon",
    baseStats: { atk: 45, crit: 15 }, minLv: 35, buyPrice: 3500, sellPrice: 700 },

  // 双持武器
  "dual_daggers": { id: "dual_daggers", name: "双匕首", type: "dual", slot: "weapon",
    baseStats: { atk: 3, spd: 8, dodge: 3 }, minLv: 1, buyPrice: 60, sellPrice: 12 },
  "twin_blades": { id: "twin_blades", name: "双刃", type: "dual", slot: "weapon",
    baseStats: { atk: 8, spd: 10, dodge: 5 }, minLv: 8, buyPrice: 300, sellPrice: 60 },
  "fang_claws": { id: "fang_claws", name: "獠牙双爪", type: "dual", slot: "weapon",
    baseStats: { atk: 15, spd: 12, dodge: 8, crit: 5 }, minLv: 18, buyPrice: 1000, sellPrice: 200 },

  // 远程武器
  "sling": { id: "sling", name: "弹弓", type: "ranged", slot: "weapon",
    baseStats: { atk: 4, spd: 3, crit: 5 }, minLv: 1, buyPrice: 40, sellPrice: 8 },
  "crossbow": { id: "crossbow", name: "弩", type: "ranged", slot: "weapon",
    baseStats: { atk: 10, spd: 2, crit: 10 }, minLv: 8, buyPrice: 250, sellPrice: 50 },
  "hunting_rifle": { id: "hunting_rifle", name: "猎枪", type: "ranged", slot: "weapon",
    baseStats: { atk: 18, spd: 1, crit: 15 }, minLv: 15, buyPrice: 600, sellPrice: 120 },
  "sniper_rifle": { id: "sniper_rifle", name: "狙击步枪", type: "ranged", slot: "weapon",
    baseStats: { atk: 30, crit: 25 }, minLv: 25, buyPrice: 2000, sellPrice: 400 },
  "gauss_rifle": { id: "gauss_rifle", name: "高斯步枪", type: "ranged", slot: "weapon",
    baseStats: { atk: 48, crit: 30, spd: 3 }, minLv: 40, buyPrice: 5000, sellPrice: 1000 },

  // 魔法武器
  "apprentice_wand": { id: "apprentice_wand", name: "学徒魔杖", type: "magic", slot: "weapon",
    baseStats: { matk: 6, mp: 10 }, minLv: 1, buyPrice: 60, sellPrice: 12 },
  "crystal_staff": { id: "crystal_staff", name: "水晶法杖", type: "magic", slot: "weapon",
    baseStats: { matk: 14, mp: 25 }, minLv: 10, buyPrice: 350, sellPrice: 70 },
  "void_scepter": { id: "void_scepter", name: "虚空权杖", type: "magic", slot: "weapon",
    baseStats: { matk: 25, mp: 50, int: 3 }, minLv: 22, buyPrice: 1500, sellPrice: 300 },
  "arcane_staff": { id: "arcane_staff", name: "奥术法杖", type: "magic", slot: "weapon",
    baseStats: { matk: 40, mp: 80, int: 8 }, minLv: 38, buyPrice: 4500, sellPrice: 900 },
};

// 防具基础模板
const ARMOR_BASE = {
  // 头部
  "cloth_hood": { id: "cloth_hood", name: "布兜帽", slot: "head", baseStats: { def: 2, mdef: 1 }, minLv: 1, buyPrice: 30, sellPrice: 6 },
  "leather_helm": { id: "leather_helm", name: "皮盔", slot: "head", baseStats: { def: 4, mdef: 2 }, minLv: 5, buyPrice: 100, sellPrice: 20 },
  "steel_helmet": { id: "steel_helmet", name: "钢盔", slot: "head", baseStats: { def: 7, mdef: 3 }, minLv: 10, buyPrice: 250, sellPrice: 50 },
  "tactical_helmet": { id: "tactical_helmet", name: "战术头盔", slot: "head", baseStats: { def: 12, mdef: 5, spd: 2 }, minLv: 20, buyPrice: 800, sellPrice: 160 },
  "power_helmet": { id: "power_helmet", name: "动力头盔", slot: "head", baseStats: { def: 20, mdef: 10, str: 3 }, minLv: 35, buyPrice: 3000, sellPrice: 600 },

  // 身体
  "rag_armor": { id: "rag_armor", name: "破布衣", slot: "body", baseStats: { def: 3, mdef: 1 }, minLv: 1, buyPrice: 40, sellPrice: 8 },
  "leather_armor": { id: "leather_armor", name: "皮甲", slot: "body", baseStats: { def: 6, mdef: 3 }, minLv: 5, buyPrice: 150, sellPrice: 30 },
  "steel_armor": { id: "steel_armor", name: "钢板甲", slot: "body", baseStats: { def: 12, mdef: 5 }, minLv: 12, buyPrice: 400, sellPrice: 80 },
  "combat_armor": { id: "combat_armor", name: "战斗装甲", slot: "body", baseStats: { def: 20, mdef: 8, vit: 2 }, minLv: 22, buyPrice: 1200, sellPrice: 240 },
  "power_armor": { id: "power_armor", name: "动力装甲", slot: "body", baseStats: { def: 35, mdef: 15, str: 5, vit: 5 }, minLv: 40, buyPrice: 5000, sellPrice: 1000 },

  // 腰带
  "cloth_belt": { id: "cloth_belt", name: "布腰带", slot: "belt", baseStats: { def: 1, mdef: 1 }, minLv: 1, buyPrice: 20, sellPrice: 4, storage: 5 },
  "leather_belt": { id: "leather_belt", name: "皮带", slot: "belt", baseStats: { def: 2, mdef: 2 }, minLv: 5, buyPrice: 80, sellPrice: 16, storage: 8 },
  "tactical_belt": { id: "tactical_belt", name: "战术腰带", slot: "belt", baseStats: { def: 4, mdef: 3, spd: 1 }, minLv: 15, buyPrice: 300, sellPrice: 60, storage: 12 },
  "utility_belt": { id: "utility_belt", name: "多功能腰带", slot: "belt", baseStats: { def: 7, mdef: 5, spd: 3 }, minLv: 28, buyPrice: 1000, sellPrice: 200, storage: 18 },

  // 裤子
  "rag_pants": { id: "rag_pants", name: "破裤子", slot: "pants", baseStats: { def: 2, mdef: 1 }, minLv: 1, buyPrice: 25, sellPrice: 5 },
  "leather_pants": { id: "leather_pants", name: "皮裤", slot: "pants", baseStats: { def: 5, mdef: 2 }, minLv: 5, buyPrice: 120, sellPrice: 24 },
  "steel_greaves": { id: "steel_greaves", name: "钢护腿", slot: "pants", baseStats: { def: 10, mdef: 4 }, minLv: 12, buyPrice: 350, sellPrice: 70 },
  "tactical_pants": { id: "tactical_pants", name: "战术裤", slot: "pants", baseStats: { def: 16, mdef: 6, agi: 2 }, minLv: 22, buyPrice: 900, sellPrice: 180 },

  // 鞋子
  "rag_shoes": { id: "rag_shoes", name: "破鞋", slot: "shoes", baseStats: { def: 1, spd: 2 }, minLv: 1, buyPrice: 20, sellPrice: 4 },
  "leather_boots": { id: "leather_boots", name: "皮靴", slot: "shoes", baseStats: { def: 3, spd: 4 }, minLv: 5, buyPrice: 100, sellPrice: 20 },
  "steel_boots": { id: "steel_boots", name: "钢靴", slot: "shoes", baseStats: { def: 6, spd: 5 }, minLv: 10, buyPrice: 250, sellPrice: 50 },
  "tactical_boots": { id: "tactical_boots", name: "战术靴", slot: "shoes", baseStats: { def: 10, spd: 8, dodge: 3 }, minLv: 20, buyPrice: 700, sellPrice: 140 },
  "power_boots": { id: "power_boots", name: "动力靴", slot: "shoes", baseStats: { def: 18, spd: 12, dodge: 5 }, minLv: 35, buyPrice: 2500, sellPrice: 500 },

  // 戒指
  "copper_ring": { id: "copper_ring", name: "铜戒指", slot: "ring", baseStats: { atk: 2, matk: 2 }, minLv: 3, buyPrice: 100, sellPrice: 20 },
  "silver_ring": { id: "silver_ring", name: "银戒指", slot: "ring", baseStats: { atk: 5, matk: 5, crit: 3 }, minLv: 10, buyPrice: 400, sellPrice: 80 },
  "gold_ring": { id: "gold_ring", name: "金戒指", slot: "ring", baseStats: { atk: 10, matk: 10, crit: 5 }, minLv: 22, buyPrice: 1500, sellPrice: 300 },

  // 项链
  "bone_necklace": { id: "bone_necklace", name: "骨制项链", slot: "necklace", baseStats: { hp: 20, mp: 10 }, minLv: 3, buyPrice: 100, sellPrice: 20 },
  "silver_necklace": { id: "silver_necklace", name: "银项链", slot: "necklace", baseStats: { hp: 50, mp: 25, wis: 2 }, minLv: 10, buyPrice: 400, sellPrice: 80 },
  "crystal_necklace": { id: "crystal_necklace", name: "水晶项链", slot: "necklace", baseStats: { hp: 100, mp: 60, wis: 5, int: 3 }, minLv: 22, buyPrice: 1500, sellPrice: 300 },

  // 护身符
  "wood_amulet": { id: "wood_amulet", name: "木制护身符", slot: "amulet", baseStats: { def: 2, mdef: 2 }, minLv: 3, buyPrice: 100, sellPrice: 20 },
  "jade_amulet": { id: "jade_amulet", name: "翡翠护身符", slot: "amulet", baseStats: { def: 5, mdef: 5, vit: 2 }, minLv: 10, buyPrice: 400, sellPrice: 80 },
  "shadow_amulet": { id: "shadow_amulet", name: "暗影护身符", slot: "amulet", baseStats: { def: 10, mdef: 10, dodge: 5, ene: 3 }, minLv: 22, buyPrice: 1500, sellPrice: 300 },
};

// 消耗品
const CONSUMABLES = {
  "health_potion_s": { id: "health_potion_s", name: "小生命药水", type: "consumable", desc: "恢复50点HP", effect: { hp: 50 }, buyPrice: 30, sellPrice: 6 },
  "health_potion_m": { id: "health_potion_m", name: "中生命药水", type: "consumable", desc: "恢复150点HP", effect: { hp: 150 }, buyPrice: 80, sellPrice: 16 },
  "health_potion_l": { id: "health_potion_l", name: "大生命药水", type: "consumable", desc: "恢复400点HP", effect: { hp: 400 }, buyPrice: 200, sellPrice: 40 },
  "mana_potion_s": { id: "mana_potion_s", name: "小魔力药水", type: "consumable", desc: "恢复30点MP", effect: { mp: 30 }, buyPrice: 25, sellPrice: 5 },
  "mana_potion_m": { id: "mana_potion_m", name: "中魔力药水", type: "consumable", desc: "恢复80点MP", effect: { mp: 80 }, buyPrice: 70, sellPrice: 14 },
  "mana_potion_l": { id: "mana_potion_l", name: "大魔力药水", type: "consumable", desc: "恢复200点MP", effect: { mp: 200 }, buyPrice: 180, sellPrice: 36 },
  "bandage": { id: "bandage", name: "绷带", type: "consumable", desc: "恢复20%最大HP", effect: { hpPct: 20 }, buyPrice: 40, sellPrice: 8 },
  "antidote": { id: "antidote", name: "解毒剂", type: "consumable", desc: "解除中毒状态", effect: { curePoison: true }, buyPrice: 50, sellPrice: 10 },
  "stimulant": { id: "stimulant", name: "兴奋剂", type: "consumable", desc: "3回合内攻击+30%", effect: { atkBuff: 30, buffTurns: 3 }, buyPrice: 100, sellPrice: 20 },
};

// 特殊物品
const SPECIAL_ITEMS = {
  "boat": { id: "boat", name: "小木船", type: "special", desc: "允许在海洋上航行。", buyPrice: 500, sellPrice: 100 },
  "ship": { id: "ship", name: "中型帆船", type: "special", desc: "更坚固的船，海洋航行速度+50%。", buyPrice: 2000, sellPrice: 400 },
  "warship": { id: "warship", name: "铁甲战舰", type: "special", desc: "可以在海洋上与海怪战斗，海洋航行速度+100%。", buyPrice: 8000, sellPrice: 1600 },
  "skill_scroll_common": { id: "skill_scroll_common", name: "技能卷轴(普通)", type: "scroll", desc: "随机学习一个普通品质技能。", buyPrice: 300, sellPrice: 60 },
  "skill_scroll_rare": { id: "skill_scroll_rare", name: "技能卷轴(稀有)", type: "scroll", desc: "随机学习一个稀有品质技能。", buyPrice: 1000, sellPrice: 200 },
  "skill_scroll_epic": { id: "skill_scroll_epic", name: "技能卷轴(史诗)", type: "scroll", desc: "随机学习一个史诗品质技能。", buyPrice: 3000, sellPrice: 600 },
  // 唯一技能书
  "skill_book_fireball": { id: "skill_book_fireball", name: "📕 火球术秘卷", type: "skill_book", desc: "记载了火球术的古老秘卷。", teaches: "fireball", buyPrice: 600, sellPrice: 120 },
  "skill_book_heal": { id: "skill_book_heal", name: "📗 治愈术要诀", type: "skill_book", desc: "记载了治愈术的修行法门。", teaches: "heal", buyPrice: 600, sellPrice: 120 },
  "skill_book_lightning": { id: "skill_book_lightning", name: "📘 闪电术奥义", type: "skill_book", desc: "记载了闪电术的雷电法则。", teaches: "lightning", buyPrice: 900, sellPrice: 180 },
  "skill_book_meteor": { id: "skill_book_meteor", name: "📙 陨石术天书", type: "skill_book", desc: "记载了陨石术的毁灭咒文。", teaches: "meteor", buyPrice: 2000, sellPrice: 400 },
  "skill_book_whirlwind": { id: "skill_book_whirlwind", name: "📓 旋风斩剑谱", type: "skill_book", desc: "记载了旋风斩的剑术秘籍。", teaches: "whirlwind", buyPrice: 800, sellPrice: 160 },
  "skill_book_soul_drain": { id: "skill_book_soul_drain", name: "📔 灵魂汲取禁术", type: "skill_book", desc: "记载了灵魂汲取的禁忌法术。", teaches: "soul_drain", buyPrice: 1500, sellPrice: 300 },
  "skill_book_execute": { id: "skill_book_execute", name: "📒 斩杀技要义", type: "skill_book", desc: "记载了斩杀技的精要。", teaches: "execute", buyPrice: 1000, sellPrice: 200 },
  "skill_book_med_kit": { id: "skill_book_med_kit", name: "📚 医疗装置图纸", type: "skill_book", desc: "记载了医疗装置的制作蓝图。", teaches: "med_kit", buyPrice: 1200, sellPrice: 240 },
  // 属性药水
  "stat_potion_str": { id: "stat_potion_str", name: "💪 力量药剂", type: "stat_potion", desc: "永久提升1点力量。", stat: "str", buyPrice: 800, sellPrice: 160 },
  "stat_potion_agi": { id: "stat_potion_agi", name: "🏃 敏捷药剂", type: "stat_potion", desc: "永久提升1点敏捷。", stat: "agi", buyPrice: 800, sellPrice: 160 },
  "stat_potion_int": { id: "stat_potion_int", name: "🧠 智力药剂", type: "stat_potion", desc: "永久提升1点智力。", stat: "int", buyPrice: 800, sellPrice: 160 },
  "stat_potion_vit": { id: "stat_potion_vit", name: "❤️ 体力药剂", type: "stat_potion", desc: "永久提升1点体力。", stat: "vit", buyPrice: 800, sellPrice: 160 },
  "stat_potion_wis": { id: "stat_potion_wis", name: "📿 智慧药剂", type: "stat_potion", desc: "永久提升1点智慧。", stat: "wis", buyPrice: 800, sellPrice: 160 },
  "stat_potion_ene": { id: "stat_potion_ene", name: "⚡ 精力药剂", type: "stat_potion", desc: "永久提升1点精力。", stat: "ene", buyPrice: 800, sellPrice: 160 },
};

// 材料
const MATERIALS = {
  "scrap_metal": { id: "scrap_metal", name: "废金属", type: "material", desc: "随处可见的金属碎片。", buyPrice: 5, sellPrice: 1 },
  "steel_ingot": { id: "steel_ingot", name: "钢锭", type: "material", desc: "冶炼过的钢材。", buyPrice: 30, sellPrice: 6 },
  "circuit_board": { id: "circuit_board", name: "电路板", type: "material", desc: "旧时代的电子元件。", buyPrice: 40, sellPrice: 8 },
  "energy_cell": { id: "energy_cell", name: "能量电池", type: "material", desc: "仍然储存着能量的电池。", buyPrice: 60, sellPrice: 12 },
  "magic_crystal": { id: "magic_crystal", name: "魔力水晶", type: "material", desc: "蕴含魔力的晶体。", buyPrice: 80, sellPrice: 16 },
  "dark_essence": { id: "dark_essence", name: "暗影精华", type: "material", desc: "从变异生物中提取的黑暗物质。", buyPrice: 100, sellPrice: 20 },
  "mutant_gland": { id: "mutant_gland", name: "变异腺体", type: "material", desc: "变异生物的腺体，有研究价值。", buyPrice: 50, sellPrice: 10 },
  "radiated_core": { id: "radiated_core", name: "辐射核心", type: "material", desc: "高辐射浓度的物质核心。", buyPrice: 150, sellPrice: 30 },
  "tech_part": { id: "tech_part", name: "高科技零件", type: "material", desc: "精密的高科技零件。", buyPrice: 200, sellPrice: 40 },
  "dragon_scale": { id: "dragon_scale", name: "龙鳞", type: "material", desc: "废土巨龙的鳞片，极其坚固。", buyPrice: 500, sellPrice: 100 },
  "dragon_heart": { id: "dragon_heart", name: "龙之心", type: "material", desc: "巨龙的心脏，蕴含无穷能量。", buyPrice: 2000, sellPrice: 400 },
  // 敌人掉落专用
  "rat_meat": { id: "rat_meat", name: "鼠肉", type: "material", desc: "变异鼠的肉，勉强可以食用。", buyPrice: 3, sellPrice: 1 },
  "dog_meat": { id: "dog_meat", name: "变异犬肉", type: "material", desc: "变异犬的肉，富含蛋白质。", buyPrice: 5, sellPrice: 2 },
  "bone": { id: "bone", name: "兽骨", type: "material", desc: "变异生物的骨头，可用于制作工具。", buyPrice: 2, sellPrice: 1 },
  "cloth_armor_scrap": { id: "cloth_armor_scrap", name: "护甲碎片", type: "material", desc: "破损护甲的残片。", buyPrice: 8, sellPrice: 2 },
  "water_purifier": { id: "water_purifier", name: "净水器", type: "material", desc: "能净化辐射水的装置。", buyPrice: 40, sellPrice: 8 },
  "gold_coin": { id: "gold_coin", name: "金币堆", type: "material", desc: "一小堆金币，可以出售换取金币。", buyPrice: 10, sellPrice: 10 },
  "weapon_part": { id: "weapon_part", name: "武器零件", type: "material", desc: "用于制作和修理武器的零件。", buyPrice: 30, sellPrice: 6 },
  "deathclaw_claw": { id: "deathclaw_claw", name: "死亡爪之爪", type: "material", desc: "死亡爪的利爪，锋利的武器材料。", buyPrice: 200, sellPrice: 40 },
  "ai_core": { id: "ai_core", name: "AI核心", type: "material", desc: "古代人工智能的核心芯片。", buyPrice: 1000, sellPrice: 200 },
  "legendary_weapon": { id: "legendary_weapon", name: "传说武器碎片", type: "material", desc: "传说级武器的碎片，蕴含强大能量。", buyPrice: 500, sellPrice: 100 },
  "legendary_armor": { id: "legendary_armor", name: "传说防具碎片", type: "material", desc: "传说级防具的碎片，蕴含强大能量。", buyPrice: 500, sellPrice: 100 },
  "leviathan_scale": { id: "leviathan_scale", name: "利维坦之鳞", type: "material", desc: "深海利维坦的鳞片，极其珍贵。", buyPrice: 800, sellPrice: 160 },
  "ocean_core": { id: "ocean_core", name: "深海核心", type: "material", desc: "从深海巨兽体内取出的能量核心。", buyPrice: 1500, sellPrice: 300 },
  "mythic_trident": { id: "mythic_trident", name: "神话三叉戟碎片", type: "material", desc: "神话武器的碎片，散发幽蓝光芒。", buyPrice: 3000, sellPrice: 600 },
};

// 所有物品索引
const ALL_ITEMS = { ...WEAPON_BASE, ...ARMOR_BASE, ...CONSUMABLES, ...SPECIAL_ITEMS, ...MATERIALS };

// 随机词缀池
const AFFIX_POOLS = {
  prefix: [
    { name: "锋利的", stats: { atk: [2, 8] }, forSlot: ["weapon"], forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "坚固的", stats: { def: [2, 6] }, forSlot: ["head","body","pants","shoes"], forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "敏捷的", stats: { agi: [1, 5] }, forSlot: ["shoes","belt"], forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "睿智的", stats: { int: [1, 5] }, forSlot: ["head","necklace"], forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "活力的", stats: { vit: [1, 5] }, forSlot: ["body","amulet"], forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "毁灭的", stats: { atk: [5, 15], crit: [3, 8] }, forSlot: ["weapon"], forQuality: ["purple","yellow","gold","black"] },
    { name: "不灭的", stats: { def: [5, 12], hp: [50, 200] }, forSlot: ["body"], forQuality: ["purple","yellow","gold","black"] },
    { name: "疾风的", stats: { spd: [3, 10], dodge: [2, 5] }, forSlot: ["shoes"], forQuality: ["purple","yellow","gold","black"] },
    { name: "魔导师的", stats: { matk: [5, 15], mp: [30, 100] }, forSlot: ["weapon"], forQuality: ["purple","yellow","gold","black"] },
    { name: "龙鳞的", stats: { def: [8, 20], mdef: [5, 15], hp: [100, 300] }, forSlot: ["body"], forQuality: ["gold","black"] },
    { name: "弑神的", stats: { atk: [10, 25], crit: [5, 15] }, forSlot: ["weapon"], forQuality: ["black"] },
    { name: "全能的", stats: { str: [2,6], agi: [2,6], int: [2,6], vit: [2,6], wis: [2,6], ene: [2,6] }, forSlot: ["ring","necklace","amulet"], forQuality: ["gold","black"] },
  ],
  suffix: [
    { name: "之狼", stats: { agi: [2, 6] }, forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "之熊", stats: { str: [2, 6] }, forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "之鹰", stats: { crit: [3, 10] }, forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "之龟", stats: { def: [3, 10] }, forQuality: ["blue","purple","yellow","gold","black"] },
    { name: "之蛇", stats: { dodge: [2, 8] }, forQuality: ["purple","yellow","gold","black"] },
    { name: "之龙", stats: { atk: [5,15], def: [3,10] }, forQuality: ["gold","black"] },
    { name: "之凤凰", stats: { hp: [100,500], mp: [50,200] }, forQuality: ["gold","black"] },
    { name: "之虚空", stats: { matk: [8,20], mdef: [5,15] }, forQuality: ["gold","black"] },
  ]
};

// ===== 物品生成函数 =====
// 生成装备物品
// playerLv: 玩家当前等级
// 掉落概率: 90% = 玩家等级±5, 8% = 玩家等级+6~+10, 2% = 玩家等级+11以上(最高100)
function generateEquipItem(baseItem, quality, playerLv) {
  const qInfo = QUALITY_COLORS[quality];
  if (!qInfo) return null;

  // 三级掉落概率决定装备等级 (最高不超过 MAX_LEVEL)
  const roll = Math.random() * 100;
  let equipLv, dropTier;
  if (roll < 90) {
    // 90%: 普通掉落 — 人物等级 ± 0~5
    equipLv = Math.max(1, playerLv + Math.floor(Math.random() * 11) - 5);
    dropTier = 0;
  } else if (roll < 98) {
    // 8%: 稀有掉落 — 人物等级 +6 ~ +10
    equipLv = Math.max(1, playerLv + 6 + Math.floor(Math.random() * 5));
    dropTier = 1;
  } else {
    // 2%: 传说掉落 — 人物等级 +11 以上, 上不封顶但不超过 MAX_LEVEL
    const maxBonus = Math.max(11, MAX_LEVEL - playerLv);
    equipLv = playerLv + 11 + Math.floor(Math.random() * maxBonus);
    dropTier = 2;
  }
  // 统一封顶
  equipLv = Math.min(MAX_LEVEL, equipLv);

  const dropTierNames = ["", "⭐稀有", "🔥传说"];
  const dropTierTag = dropTierNames[dropTier];

  const stats = {};
  // 属性按装备等级缩放
  const lvScale = equipLv / Math.max(1, baseItem.minLv || 1);
  for (const key in baseItem.baseStats) {
    stats[key] = Math.floor(baseItem.baseStats[key] * lvScale * qInfo.mul);
  }

  // 应用随机词缀
  const nameParts = [];
  let affixDescs = [];

  // 根据品质决定词缀数量
  let affixCount = 0;
  if (quality === "blue") affixCount = 1;
  else if (quality === "purple") affixCount = 2;
  else if (quality === "yellow") affixCount = 3;
  else if (quality === "gold") affixCount = 4;
  else if (quality === "black") affixCount = 6;

  const matchingPrefixes = AFFIX_POOLS.prefix.filter(a =>
    a.forSlot.includes(baseItem.slot) && a.forQuality.includes(quality)
  );
  const matchingSuffixes = AFFIX_POOLS.suffix.filter(a =>
    (a.forSlot ? a.forSlot.includes(baseItem.slot) : true) && a.forQuality.includes(quality)
  );

  for (let i = 0; i < affixCount; i++) {
    const usePrefix = Math.random() < 0.5 && matchingPrefixes.length > 0;
    const pool = usePrefix ? matchingPrefixes : matchingSuffixes;
    if (pool.length === 0) continue;

    const affix = pool[Math.floor(Math.random() * pool.length)];
    for (const key in affix.stats) {
      const [min, max] = affix.stats[key];
      const val = Math.floor(Math.random() * (max - min + 1)) + min;
      stats[key] = (stats[key] || 0) + Math.floor(val * qInfo.mul);
    }
    nameParts.push(affix.name);
    affixDescs.push(`${affix.name}: ${JSON.stringify(affix.stats)}`);

    // 某些词缀只能出现一次
    if (usePrefix) {
      const idx = matchingPrefixes.indexOf(affix);
      if (idx >= 0) matchingPrefixes.splice(idx, 1);
    }
  }

  const name = (dropTierTag ? "[" + dropTierTag + "] " : "") + qInfo.prefix + (nameParts.length > 0 ? nameParts.join("") : "") + baseItem.name;

  return {
    id: baseItem.id + "_" + quality + "_" + Date.now() + Math.floor(Math.random() * 1000),
    baseId: baseItem.id,
    name,
    type: "equipment",
    slot: baseItem.slot,
    weaponType: baseItem.type || null,
    quality,
    qualityName: qInfo.name,
    qualityColor: qInfo.color,
    minLv: equipLv,
    dropTier,
    stats,
    affixDescs,
    buyPrice: Math.floor((baseItem.buyPrice || 10) * qInfo.mul * 2),
    sellPrice: Math.floor((baseItem.sellPrice || 2) * qInfo.mul),
    storage: baseItem.storage || 0,
    durability: 100,
    maxDurability: 100,
  };
}

function qualityIndex(q) {
  const order = ["white","blue","purple","yellow","gold","black"];
  return order.indexOf(q);
}

// 生成随机品质 (与玩家等级无关 — 低级也可能出神话, 高级也可能出普通)
function randomQuality(playerLv) {
  const roll = Math.random() * 100;
  // 固定品质概率, 不受等级影响
  if (roll < 0.5)  return "black";    // 0.5% 神话
  if (roll < 2.5)  return "gold";     // 2.0% 传说
  if (roll < 10.5) return "yellow";   // 8.0% 完美
  if (roll < 30.5) return "purple";   // 20% 优秀
  if (roll < 55.5) return "blue";     // 25% 精良
  return "white";                     // 44.5% 普通
}

// 游戏最大等级
const MAX_LEVEL = 100;
