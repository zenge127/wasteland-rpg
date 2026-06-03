// ===== 技能数据 v2.0 =====
// 技能覆盖等级1-100，每5-10级有新技能可学
// 主动技能: physical(物理) / magic(魔法) / science(科学)
// 被动技能: stat_boost(属性) / aura(光环) / special(特殊)

const ALL_SKILLS = {

  // ================================================================
  // 主动技能 - 物理系 (22个)
  // ================================================================
  "heavy_strike": {
    id: "heavy_strike", name: "重击", type: "active", category: "physical",
    desc: "凝聚全力的一击，造成150%物理伤害。", mpCost: 8, cooldown: 0, power: 150,
    target: "enemy", element: "physical",
    learnReq: { lv: 1 }, buyPrice: 100, rarity: "common"
  },
  "shield_bash": {
    id: "shield_bash", name: "盾击", type: "active", category: "physical",
    desc: "用盾猛击敌人，造成110%物理伤害并眩晕1回合。", mpCost: 12, cooldown: 2, power: 110,
    target: "enemy", element: "physical",
    learnReq: { lv: 3, str: 12 }, buyPrice: 300, rarity: "common"
  },
  "power_shot": {
    id: "power_shot", name: "强力射击", type: "active", category: "physical",
    desc: "精准远程射击，造成160%物理伤害。", mpCost: 12, cooldown: 0, power: 160,
    target: "enemy", element: "physical",
    learnReq: { lv: 5, agi: 14 }, buyPrice: 400, rarity: "common"
  },
  "whirlwind": {
    id: "whirlwind", name: "旋风斩", type: "active", category: "physical",
    desc: "旋转攻击，造成120%物理伤害，20%几率流血3回合。", mpCost: 15, cooldown: 1, power: 120,
    target: "enemy", element: "physical",
    learnReq: { lv: 8, str: 18 }, buyPrice: 600, rarity: "uncommon"
  },
  "sneak_attack": {
    id: "sneak_attack", name: "暗袭", type: "active", category: "physical",
    desc: "趁敌不备的攻击，造成180%物理伤害，暴击率+30%。", mpCost: 18, cooldown: 2, power: 180,
    target: "enemy", element: "physical",
    learnReq: { lv: 12, agi: 22 }, buyPrice: 1000, rarity: "uncommon"
  },
  "dual_slash": {
    id: "dual_slash", name: "双持连斩", type: "active", category: "physical",
    desc: "快速攻击两次，每次造成95%物理伤害。", mpCost: 16, cooldown: 1, power: 95,
    target: "enemy", element: "physical",
    learnReq: { lv: 15, str: 25, agi: 20 }, buyPrice: 1500, rarity: "uncommon"
  },
  "execute": {
    id: "execute", name: "处决", type: "active", category: "physical",
    desc: "对生命低于30%的敌人造成260%物理伤害。", mpCost: 22, cooldown: 3, power: 260,
    target: "enemy", element: "physical",
    learnReq: { lv: 18, str: 35 }, buyPrice: 2000, rarity: "rare"
  },
  "armor_break": {
    id: "armor_break", name: "破甲一击", type: "active", category: "physical",
    desc: "无视60%防御的强力攻击，造成200%物理伤害。", mpCost: 25, cooldown: 2, power: 200,
    target: "enemy", element: "physical",
    learnReq: { lv: 22, str: 40 }, buyPrice: 3000, rarity: "rare"
  },
  "rend": {
    id: "rend", name: "撕裂", type: "active", category: "physical",
    desc: "撕裂伤口，造成140%伤害并附加最大HP10%的流血(3回合)。", mpCost: 20, cooldown: 2, power: 140,
    target: "enemy", element: "physical",
    learnReq: { lv: 26, str: 45, agi: 35 }, buyPrice: 4000, rarity: "rare"
  },
  "death_strike": {
    id: "death_strike", name: "死亡打击", type: "active", category: "physical",
    desc: "致命一击，造成230%物理伤害，对HP低于50%的敌人伤害翻倍。", mpCost: 30, cooldown: 3, power: 230,
    target: "enemy", element: "dark",
    learnReq: { lv: 30, str: 55 }, buyPrice: 5000, rarity: "epic"
  },
  "tiger_charge": {
    id: "tiger_charge", name: "猛虎冲锋", type: "active", category: "physical",
    desc: "冲锋攻击，造成250%物理伤害，自身速度+20%持续2回合。", mpCost: 28, cooldown: 2, power: 250,
    target: "enemy", element: "physical",
    learnReq: { lv: 34, str: 60, agi: 45 }, buyPrice: 6500, rarity: "epic"
  },
  "counter_stance": {
    id: "counter_stance", name: "反击姿态", type: "active", category: "physical",
    desc: "进入反击姿态，防御+50%持续2回合，受到攻击时反击80%伤害。", mpCost: 25, cooldown: 3, power: 80,
    target: "self", element: "physical",
    learnReq: { lv: 38, str: 65, vit: 55 }, buyPrice: 8000, rarity: "epic"
  },
  "endless_storm": {
    id: "endless_storm", name: "无尽风暴", type: "active", category: "physical",
    desc: "连续3次攻击，每次造成120%物理伤害。", mpCost: 40, cooldown: 4, power: 120,
    target: "enemy", element: "physical",
    learnReq: { lv: 42, str: 75, agi: 60 }, buyPrice: 10000, rarity: "legendary"
  },
  "fatal_blow": {
    id: "fatal_blow", name: "致命一击", type: "active", category: "physical",
    desc: "瞄准要害，造成300%物理伤害，暴击率+40%。", mpCost: 35, cooldown: 3, power: 300,
    target: "enemy", element: "physical",
    learnReq: { lv: 48, str: 85 }, buyPrice: 15000, rarity: "legendary"
  },
  "doom_slash": {
    id: "doom_slash", name: "毁灭斩击", type: "active", category: "physical",
    desc: "毁灭性的一击，造成350%物理伤害，无视目标防御。", mpCost: 50, cooldown: 4, power: 350,
    target: "enemy", element: "dark",
    learnReq: { lv: 55, str: 100 }, buyPrice: 22000, rarity: "legendary"
  },
  "war_god_rage": {
    id: "war_god_rage", name: "战神之怒", type: "active", category: "physical",
    desc: "激发战神之力，接下来3回合攻击力+50%，暴击率+30%。", mpCost: 45, cooldown: 5, power: 0,
    target: "self", element: "holy",
    learnReq: { lv: 62, str: 115 }, buyPrice: 30000, rarity: "legendary"
  },
  "spatial_slash": {
    id: "spatial_slash", name: "裂空斩", type: "active", category: "physical",
    desc: "斩裂空间的攻击，造成420%物理伤害，30%几率即死(限普通怪)。", mpCost: 60, cooldown: 5, power: 420,
    target: "enemy", element: "physical",
    learnReq: { lv: 70, str: 130, agi: 100 }, buyPrice: 40000, rarity: "legendary"
  },
  "divine_judgment": {
    id: "divine_judgment", name: "神罚", type: "active", category: "physical",
    desc: "降下神罚，造成500%物理伤害，驱散目标所有增益。", mpCost: 70, cooldown: 6, power: 500,
    target: "enemy", element: "holy",
    learnReq: { lv: 78, str: 150 }, buyPrice: 55000, rarity: "legendary"
  },
  "apocalypse_blade": {
    id: "apocalypse_blade", name: "末日审判", type: "active", category: "physical",
    desc: "召唤末日之刃，对敌人造成600%物理伤害，附加虚弱(3回合)。", mpCost: 80, cooldown: 6, power: 600,
    target: "enemy", element: "dark",
    learnReq: { lv: 85, str: 170, agi: 130 }, buyPrice: 80000, rarity: "legendary"
  },
  "world_breaker": {
    id: "world_breaker", name: "世界终结", type: "active", category: "physical",
    desc: "终极物理技能，造成800%物理伤害，无视所有防御和抗性。", mpCost: 100, cooldown: 8, power: 800,
    target: "enemy", element: "physical",
    learnReq: { lv: 95, str: 200 }, buyPrice: 150000, rarity: "legendary"
  },

  // ================================================================
  // 主动技能 - 魔法系 (22个)
  // ================================================================
  "fireball": {
    id: "fireball", name: "火球术", type: "active", category: "magic",
    desc: "投掷一枚火球，造成150%魔法伤害，20%几率灼烧3回合。", mpCost: 10, cooldown: 0, power: 150,
    target: "enemy", element: "fire",
    learnReq: { lv: 1 }, buyPrice: 100, rarity: "common"
  },
  "ice_spike": {
    id: "ice_spike", name: "冰锥术", type: "active", category: "magic",
    desc: "发射冰锥，造成140%魔法伤害并减速敌人2回合。", mpCost: 14, cooldown: 1, power: 140,
    target: "enemy", element: "ice",
    learnReq: { lv: 3, int: 14 }, buyPrice: 300, rarity: "common"
  },
  "heal": {
    id: "heal", name: "治愈术", type: "active", category: "magic",
    desc: "圣光治愈，恢复自身最大HP的25%。", mpCost: 15, cooldown: 2, power: 0,
    target: "self", element: "holy",
    learnReq: { lv: 6, wis: 14 }, buyPrice: 400, rarity: "common"
  },
  "lightning": {
    id: "lightning", name: "雷击术", type: "active", category: "magic",
    desc: "召唤雷电，造成170%魔法伤害，30%几率麻痹1回合。", mpCost: 18, cooldown: 1, power: 170,
    target: "enemy", element: "thunder",
    learnReq: { lv: 10, int: 22 }, buyPrice: 800, rarity: "uncommon"
  },
  "dark_bolt": {
    id: "dark_bolt", name: "暗影箭", type: "active", category: "magic",
    desc: "释放暗影能量造成190%魔法伤害，无视40%魔防。", mpCost: 20, cooldown: 1, power: 190,
    target: "enemy", element: "dark",
    learnReq: { lv: 14, int: 28 }, buyPrice: 1200, rarity: "uncommon"
  },
  "soul_drain": {
    id: "soul_drain", name: "灵魂吸取", type: "active", category: "magic",
    desc: "吸取敌人生命，造成130%魔法伤害并恢复等量HP。", mpCost: 22, cooldown: 2, power: 130,
    target: "enemy", element: "dark",
    learnReq: { lv: 18, int: 35, wis: 28 }, buyPrice: 2000, rarity: "rare"
  },
  "meteor": {
    id: "meteor", name: "陨石术", type: "active", category: "magic",
    desc: "召唤陨石坠落，造成230%魔法伤害，灼烧地面2回合。", mpCost: 30, cooldown: 3, power: 230,
    target: "enemy", element: "fire",
    learnReq: { lv: 20, int: 42 }, buyPrice: 2500, rarity: "rare"
  },
  "blizzard": {
    id: "blizzard", name: "暴风雪", type: "active", category: "magic",
    desc: "极寒暴风雪，对敌人造成210%魔法伤害并减速3回合。", mpCost: 28, cooldown: 2, power: 210,
    target: "enemy", element: "ice",
    learnReq: { lv: 24, int: 48 }, buyPrice: 3500, rarity: "rare"
  },
  "purify": {
    id: "purify", name: "净化术", type: "active", category: "magic",
    desc: "圣光净化，恢复自身最大HP的40%并移除所有负面状态。", mpCost: 30, cooldown: 3, power: 0,
    target: "self", element: "holy",
    learnReq: { lv: 28, wis: 45 }, buyPrice: 4500, rarity: "rare"
  },
  "chain_lightning": {
    id: "chain_lightning", name: "连锁闪电", type: "active", category: "magic",
    desc: "连锁雷击，造成250%魔法伤害，连锁弹跳3次(每次递减20%)。", mpCost: 35, cooldown: 3, power: 250,
    target: "enemy", element: "thunder",
    learnReq: { lv: 32, int: 60 }, buyPrice: 6000, rarity: "epic"
  },
  "black_hole": {
    id: "black_hole", name: "黑洞", type: "active", category: "magic",
    desc: "创造小型黑洞，造成280%魔法伤害，敌人无法行动1回合。", mpCost: 40, cooldown: 4, power: 280,
    target: "enemy", element: "dark",
    learnReq: { lv: 36, int: 70, wis: 55 }, buyPrice: 7500, rarity: "epic"
  },
  "time_freeze": {
    id: "time_freeze", name: "时间冻结", type: "active", category: "magic",
    desc: "冻结时间流动，敌人跳过2回合，自身恢复20%HP。", mpCost: 45, cooldown: 5, power: 0,
    target: "enemy", element: "ice",
    learnReq: { lv: 40, int: 80, wis: 65 }, buyPrice: 10000, rarity: "epic"
  },
  "inferno": {
    id: "inferno", name: "地狱火", type: "active", category: "magic",
    desc: "召唤地狱烈焰，造成320%魔法伤害并灼烧5回合。", mpCost: 50, cooldown: 4, power: 320,
    target: "enemy", element: "fire",
    learnReq: { lv: 44, int: 90 }, buyPrice: 13000, rarity: "legendary"
  },
  "elemental_storm": {
    id: "elemental_storm", name: "元素风暴", type: "active", category: "magic",
    desc: "四元素混合风暴，造成380%魔法伤害(随机元素属性)。", mpCost: 55, cooldown: 4, power: 380,
    target: "enemy", element: "fire",
    learnReq: { lv: 50, int: 105 }, buyPrice: 18000, rarity: "legendary"
  },
  "cataclysm": {
    id: "cataclysm", name: "大灾变", type: "active", category: "magic",
    desc: "引发灾变之灾，造成440%魔法伤害，降低全属性10%持续3回合。", mpCost: 65, cooldown: 5, power: 440,
    target: "enemy", element: "dark",
    learnReq: { lv: 58, int: 120 }, buyPrice: 26000, rarity: "legendary"
  },
  "astral_projection": {
    id: "astral_projection", name: "星界投射", type: "active", category: "magic",
    desc: "将自身投射至星界，2回合内无敌并恢复30%HP/MP。", mpCost: 60, cooldown: 6, power: 0,
    target: "self", element: "holy",
    learnReq: { lv: 64, int: 135, wis: 100 }, buyPrice: 35000, rarity: "legendary"
  },
  "spacetime_rift": {
    id: "spacetime_rift", name: "时空裂隙", type: "active", category: "magic",
    desc: "撕裂时空，造成500%魔法伤害，50%几率立即获得额外回合。", mpCost: 75, cooldown: 6, power: 500,
    target: "enemy", element: "thunder",
    learnReq: { lv: 72, int: 150 }, buyPrice: 50000, rarity: "legendary"
  },
  "void_sphere": {
    id: "void_sphere", name: "虚无法球", type: "active", category: "magic",
    desc: "凝聚虚空能量，造成580%魔法伤害，吞噬敌人所有增益。", mpCost: 85, cooldown: 7, power: 580,
    target: "enemy", element: "dark",
    learnReq: { lv: 80, int: 170, wis: 130 }, buyPrice: 70000, rarity: "legendary"
  },
  "genesis_light": {
    id: "genesis_light", name: "创世之光", type: "active", category: "magic",
    desc: "创世级圣光，造成650%魔法伤害，治疗自身50%HP。", mpCost: 90, cooldown: 7, power: 650,
    target: "enemy", element: "holy",
    learnReq: { lv: 88, int: 190, wis: 150 }, buyPrice: 100000, rarity: "legendary"
  },
  "cosmic_burst": {
    id: "cosmic_burst", name: "宇宙大爆炸", type: "active", category: "magic",
    desc: "终极魔法技能，引发宇宙级爆炸造成850%魔法伤害。", mpCost: 120, cooldown: 8, power: 850,
    target: "enemy", element: "fire",
    learnReq: { lv: 96, int: 220 }, buyPrice: 180000, rarity: "legendary"
  },

  // ================================================================
  // 主动技能 - 科学系 (18个)
  // ================================================================
  "grenade": {
    id: "grenade", name: "手雷投掷", type: "active", category: "science",
    desc: "投掷手雷，造成160%物理+火焰伤害。", mpCost: 6, cooldown: 1, power: 160,
    target: "enemy", element: "fire",
    learnReq: { lv: 4, int: 12 }, buyPrice: 350, rarity: "common"
  },
  "med_kit": {
    id: "med_kit", name: "医疗包", type: "active", category: "science",
    desc: "使用高级医疗包恢复35%最大HP并移除负面状态。", mpCost: 8, cooldown: 3, power: 0,
    target: "self", element: "heal",
    learnReq: { lv: 8, int: 18 }, buyPrice: 600, rarity: "uncommon"
  },
  "turret": {
    id: "turret", name: "部署炮台", type: "active", category: "science",
    desc: "部署自动炮台，每回合造成80%物理伤害，持续3回合。", mpCost: 22, cooldown: 3, power: 80,
    target: "enemy", element: "physical",
    learnReq: { lv: 12, int: 24 }, buyPrice: 1000, rarity: "uncommon"
  },
  "EMP": {
    id: "EMP", name: "EMP脉冲", type: "active", category: "science",
    desc: "电磁脉冲，对机械敌人造成250%伤害，对其他降低50%伤害。", mpCost: 20, cooldown: 2, power: 250,
    target: "enemy", element: "thunder",
    learnReq: { lv: 16, int: 30 }, buyPrice: 1800, rarity: "rare"
  },
  "landmine": {
    id: "landmine", name: "地雷布置", type: "active", category: "science",
    desc: "布置地雷，2回合后爆炸造成300%物理伤害。", mpCost: 25, cooldown: 3, power: 300,
    target: "enemy", element: "physical",
    learnReq: { lv: 20, int: 38 }, buyPrice: 2800, rarity: "rare"
  },
  "nano_repair": {
    id: "nano_repair", name: "纳米修复", type: "active", category: "science",
    desc: "注入纳米机器人，恢复50%最大HP并持续恢复10%HP×3回合。", mpCost: 30, cooldown: 4, power: 0,
    target: "self", element: "heal",
    learnReq: { lv: 24, int: 45 }, buyPrice: 4000, rarity: "rare"
  },
  "mech_summon": {
    id: "mech_summon", name: "机甲召唤", type: "active", category: "science",
    desc: "召唤战斗机甲，造成280%物理伤害并眩晕1回合。", mpCost: 35, cooldown: 4, power: 280,
    target: "enemy", element: "physical",
    learnReq: { lv: 28, int: 52 }, buyPrice: 5500, rarity: "epic"
  },
  "vulcan_cannon": {
    id: "vulcan_cannon", name: "火神炮", type: "active", category: "science",
    desc: "重型火神炮扫射，连续4次攻击每次70%物理伤害。", mpCost: 40, cooldown: 4, power: 70,
    target: "enemy", element: "physical",
    learnReq: { lv: 32, int: 60, str: 50 }, buyPrice: 7000, rarity: "epic"
  },
  "energy_shield": {
    id: "energy_shield", name: "能量护盾", type: "active", category: "science",
    desc: "激活能量护盾，吸收接下来3次攻击的50%伤害。", mpCost: 35, cooldown: 5, power: 0,
    target: "self", element: "holy",
    learnReq: { lv: 36, int: 68 }, buyPrice: 8500, rarity: "epic"
  },
  "tactical_nuke": {
    id: "tactical_nuke", name: "战术核弹", type: "active", category: "science",
    desc: "发射微型核弹，造成400%物理+火焰伤害，辐射3回合。", mpCost: 55, cooldown: 6, power: 400,
    target: "enemy", element: "fire",
    learnReq: { lv: 42, int: 80 }, buyPrice: 12000, rarity: "legendary"
  },
  "bioweapon": {
    id: "bioweapon", name: "生化武器", type: "active", category: "science",
    desc: "释放生化毒气，造成320%伤害并附加中毒/减速/虚弱。", mpCost: 48, cooldown: 4, power: 320,
    target: "enemy", element: "dark",
    learnReq: { lv: 48, int: 90 }, buyPrice: 16000, rarity: "legendary"
  },
  "antimatter_beam": {
    id: "antimatter_beam", name: "反物质光束", type: "active", category: "science",
    desc: "反物质能量束，造成480%魔法伤害，无视所有防御。", mpCost: 60, cooldown: 5, power: 480,
    target: "enemy", element: "dark",
    learnReq: { lv: 54, int: 105 }, buyPrice: 24000, rarity: "legendary"
  },
  "orbital_strike": {
    id: "orbital_strike", name: "轨道打击", type: "active", category: "science",
    desc: "呼叫轨道卫星打击，造成520%物理伤害，2回合后命中。", mpCost: 70, cooldown: 6, power: 520,
    target: "enemy", element: "physical",
    learnReq: { lv: 60, int: 120 }, buyPrice: 32000, rarity: "legendary"
  },
  "quantum_teleport": {
    id: "quantum_teleport", name: "量子传送", type: "active", category: "science",
    desc: "量子传送突袭，造成380%伤害并获得额外回合。", mpCost: 65, cooldown: 5, power: 380,
    target: "enemy", element: "thunder",
    learnReq: { lv: 66, int: 135, agi: 100 }, buyPrice: 42000, rarity: "legendary"
  },
  "dimensional_weapon": {
    id: "dimensional_weapon", name: "维度武器", type: "active", category: "science",
    desc: "发射跨维度能量弹，造成560%伤害，50%穿透防御。", mpCost: 80, cooldown: 6, power: 560,
    target: "enemy", element: "dark",
    learnReq: { lv: 74, int: 155 }, buyPrice: 60000, rarity: "legendary"
  },
  "blackhole_bomb": {
    id: "blackhole_bomb", name: "黑洞炸弹", type: "active", category: "science",
    desc: "投掷微型黑洞弹，造成620%伤害并吞噬一切增益/减益。", mpCost: 90, cooldown: 7, power: 620,
    target: "enemy", element: "dark",
    learnReq: { lv: 82, int: 175 }, buyPrice: 85000, rarity: "legendary"
  },
  "reality_rewrite": {
    id: "reality_rewrite", name: "现实改写", type: "active", category: "science",
    desc: "改写现实法则，造成700%伤害，敌人属性永久降低15%。", mpCost: 100, cooldown: 7, power: 700,
    target: "enemy", element: "thunder",
    learnReq: { lv: 90, int: 200 }, buyPrice: 130000, rarity: "legendary"
  },
  "omega_weapon": {
    id: "omega_weapon", name: "终焉兵器", type: "active", category: "science",
    desc: "终极科技武器，造成900%全属性伤害，必定暴击。", mpCost: 130, cooldown: 8, power: 900,
    target: "enemy", element: "fire",
    learnReq: { lv: 98, int: 230 }, buyPrice: 200000, rarity: "legendary"
  },

  // ================================================================
  // 被动技能 - 属性提升 (18个)
  // ================================================================
  "muscle_memory": {
    id: "muscle_memory", name: "肌肉记忆", type: "passive", category: "stat_boost",
    desc: "力量永久+5。", power: 0, statBonus: { str: 5 },
    learnReq: { lv: 2, str: 10 }, buyPrice: 300, rarity: "common"
  },
  "quick_reflex": {
    id: "quick_reflex", name: "快速反射", type: "passive", category: "stat_boost",
    desc: "敏捷永久+5。", power: 0, statBonus: { agi: 5 },
    learnReq: { lv: 2, agi: 10 }, buyPrice: 300, rarity: "common"
  },
  "brain_training": {
    id: "brain_training", name: "脑力训练", type: "passive", category: "stat_boost",
    desc: "智力永久+5。", power: 0, statBonus: { int: 5 },
    learnReq: { lv: 2, int: 10 }, buyPrice: 300, rarity: "common"
  },
  "body_hardening": {
    id: "body_hardening", name: "身体强化", type: "passive", category: "stat_boost",
    desc: "体力永久+5。", power: 0, statBonus: { vit: 5 },
    learnReq: { lv: 2, vit: 10 }, buyPrice: 300, rarity: "common"
  },
  "spirit_boost": {
    id: "spirit_boost", name: "精神修炼", type: "passive", category: "stat_boost",
    desc: "智慧永久+5。", power: 0, statBonus: { wis: 5 },
    learnReq: { lv: 2, wis: 10 }, buyPrice: 300, rarity: "common"
  },
  "endurance": {
    id: "endurance", name: "耐力训练", type: "passive", category: "stat_boost",
    desc: "精力永久+5。", power: 0, statBonus: { ene: 5 },
    learnReq: { lv: 2, ene: 10 }, buyPrice: 300, rarity: "common"
  },
  // 中级属性
  "giant_strength": {
    id: "giant_strength", name: "巨人之力", type: "passive", category: "stat_boost",
    desc: "力量永久+15。", power: 0, statBonus: { str: 15 },
    learnReq: { lv: 16, str: 30 }, buyPrice: 1800, rarity: "uncommon"
  },
  "shadow_step": {
    id: "shadow_step", name: "暗影步法", type: "passive", category: "stat_boost",
    desc: "敏捷永久+15。", power: 0, statBonus: { agi: 15 },
    learnReq: { lv: 16, agi: 30 }, buyPrice: 1800, rarity: "uncommon"
  },
  "advanced_scholar": {
    id: "advanced_scholar", name: "高级学者", type: "passive", category: "stat_boost",
    desc: "智力永久+15。", power: 0, statBonus: { int: 15 },
    learnReq: { lv: 16, int: 30 }, buyPrice: 1800, rarity: "uncommon"
  },
  "iron_body": {
    id: "iron_body", name: "钢铁之躯", type: "passive", category: "stat_boost",
    desc: "体力永久+15。", power: 0, statBonus: { vit: 15 },
    learnReq: { lv: 16, vit: 30 }, buyPrice: 1800, rarity: "uncommon"
  },
  "sage_wisdom": {
    id: "sage_wisdom", name: "贤者智慧", type: "passive", category: "stat_boost",
    desc: "智慧永久+15。", power: 0, statBonus: { wis: 15 },
    learnReq: { lv: 16, wis: 30 }, buyPrice: 1800, rarity: "uncommon"
  },
  "unlimited_energy": {
    id: "unlimited_energy", name: "无限精力", type: "passive", category: "stat_boost",
    desc: "精力永久+15。", power: 0, statBonus: { ene: 15 },
    learnReq: { lv: 16, ene: 30 }, buyPrice: 1800, rarity: "uncommon"
  },
  // 高级属性
  "titan_power": {
    id: "titan_power", name: "泰坦之力", type: "passive", category: "stat_boost",
    desc: "力量永久+30。", power: 0, statBonus: { str: 30 },
    learnReq: { lv: 34, str: 65 }, buyPrice: 7000, rarity: "epic"
  },
  "storm_rider": {
    id: "storm_rider", name: "风暴行者", type: "passive", category: "stat_boost",
    desc: "敏捷永久+30。", power: 0, statBonus: { agi: 30 },
    learnReq: { lv: 34, agi: 65 }, buyPrice: 7000, rarity: "epic"
  },
  "omniscient": {
    id: "omniscient", name: "全知者", type: "passive", category: "stat_boost",
    desc: "智力永久+30。", power: 0, statBonus: { int: 30 },
    learnReq: { lv: 34, int: 65 }, buyPrice: 7000, rarity: "epic"
  },
  // 顶级属性
  "godly_might": {
    id: "godly_might", name: "神威", type: "passive", category: "stat_boost",
    desc: "所有属性永久+25。", power: 0,
    statBonus: { str: 25, agi: 25, int: 25, vit: 25, wis: 25, ene: 25 },
    learnReq: { lv: 56 }, buyPrice: 25000, rarity: "legendary"
  },
  "transcendence": {
    id: "transcendence", name: "超凡入圣", type: "passive", category: "stat_boost",
    desc: "所有属性永久+45。", power: 0,
    statBonus: { str: 45, agi: 45, int: 45, vit: 45, wis: 45, ene: 45 },
    learnReq: { lv: 76 }, buyPrice: 60000, rarity: "legendary"
  },
  "omega_perfection": {
    id: "omega_perfection", name: "终焉完美", type: "passive", category: "stat_boost",
    desc: "所有属性永久+70。", power: 0,
    statBonus: { str: 70, agi: 70, int: 70, vit: 70, wis: 70, ene: 70 },
    learnReq: { lv: 92 }, buyPrice: 150000, rarity: "legendary"
  },

  // ================================================================
  // 被动技能 - 战斗光环 (12个)
  // ================================================================
  "hp_boost": {
    id: "hp_boost", name: "生命力场", type: "passive", category: "aura",
    desc: "最大HP+20%。", statBonus: { hpBonus: 20 },
    learnReq: { lv: 8, vit: 18 }, buyPrice: 800, rarity: "common"
  },
  "mp_boost": {
    id: "mp_boost", name: "魔力增幅", type: "passive", category: "aura",
    desc: "最大MP+20%。", statBonus: { mpBonus: 20 },
    learnReq: { lv: 8, wis: 18 }, buyPrice: 800, rarity: "common"
  },
  "damage_aura": {
    id: "damage_aura", name: "战斗光环", type: "passive", category: "aura",
    desc: "物理攻击+15%。", statBonus: { atkBonus: 15 },
    learnReq: { lv: 14, str: 28 }, buyPrice: 1400, rarity: "uncommon"
  },
  "magic_aura": {
    id: "magic_aura", name: "魔力光环", type: "passive", category: "aura",
    desc: "魔法攻击+15%。", statBonus: { matkBonus: 15 },
    learnReq: { lv: 14, int: 28 }, buyPrice: 1400, rarity: "uncommon"
  },
  "defense_aura": {
    id: "defense_aura", name: "防御光环", type: "passive", category: "aura",
    desc: "物理防御+15%。", statBonus: { defBonus: 15 },
    learnReq: { lv: 14, vit: 28 }, buyPrice: 1400, rarity: "uncommon"
  },
  "critical_mastery": {
    id: "critical_mastery", name: "暴击精通", type: "passive", category: "aura",
    desc: "暴击率+12%。", statBonus: { critBonus: 12 },
    learnReq: { lv: 18, ene: 30 }, buyPrice: 2200, rarity: "uncommon"
  },
  "speed_aura": {
    id: "speed_aura", name: "疾风光环", type: "passive", category: "aura",
    desc: "速度+15%，闪避+8%。", statBonus: { spdBonus: 15, dodgeBonus: 8 },
    learnReq: { lv: 22, agi: 42 }, buyPrice: 3200, rarity: "rare"
  },
  "leech_aura": {
    id: "leech_aura", name: "吸血光环", type: "passive", category: "aura",
    desc: "攻击时恢复造成伤害的10%HP。", statBonus: { lifeLeech: 10 },
    learnReq: { lv: 30, str: 52, vit: 48 }, buyPrice: 5500, rarity: "epic"
  },
  "thorn_aura": {
    id: "thorn_aura", name: "荆棘光环", type: "passive", category: "aura",
    desc: "受到攻击时反弹20%伤害给敌人。", statBonus: { thorns: 20 },
    learnReq: { lv: 38, vit: 68 }, buyPrice: 8000, rarity: "epic"
  },
  "grand_aura": {
    id: "grand_aura", name: "大光环", type: "passive", category: "aura",
    desc: "攻击+25%，防御+25%，速度+25%。", statBonus: { atkBonus: 25, defBonus: 25, spdBonus: 25 },
    learnReq: { lv: 52 }, buyPrice: 20000, rarity: "legendary"
  },
  "apocalypse_aura": {
    id: "apocalypse_aura", name: "末日光环", type: "passive", category: "aura",
    desc: "攻击+40%，暴击+25%，吸血+15%。", statBonus: { atkBonus: 40, matkBonus: 40, critBonus: 25, lifeLeech: 15 },
    learnReq: { lv: 68 }, buyPrice: 45000, rarity: "legendary"
  },
  "divine_aura": {
    id: "divine_aura", name: "神性光环", type: "passive", category: "aura",
    desc: "全属性+60%攻击/防御/速度，HP/MP+50%。", statBonus: { atkBonus: 60, matkBonus: 60, defBonus: 60, spdBonus: 60, hpBonus: 50, mpBonus: 50 },
    learnReq: { lv: 84 }, buyPrice: 100000, rarity: "legendary"
  },

  // ================================================================
  // 被动技能 - 特殊被动 (8个)
  // ================================================================
  "withering_touch": {
    id: "withering_touch", name: "枯萎之触", type: "passive", category: "special",
    desc: "攻击有20%几率降低敌人攻击力15%持续2回合。",
    learnReq: { lv: 20, int: 35 }, buyPrice: 2500, rarity: "rare"
  },
  "fear_presence": {
    id: "fear_presence", name: "恐惧光环", type: "passive", category: "special",
    desc: "战斗开始时，敌人有25%几率被恐惧2回合。",
    learnReq: { lv: 26, wis: 42 }, buyPrice: 4000, rarity: "rare"
  },
  "double_cast": {
    id: "double_cast", name: "双重施法", type: "passive", category: "special",
    desc: "使用魔法技能时有25%几率再次施放(伤害50%)。",
    learnReq: { lv: 40, int: 75 }, buyPrice: 10000, rarity: "epic"
  },
  "undying_will": {
    id: "undying_will", name: "不灭意志", type: "passive", category: "special",
    desc: "受到致命伤害时有30%几率以1HP存活(每场战斗1次)。",
    learnReq: { lv: 46, vit: 85 }, buyPrice: 14000, rarity: "legendary"
  },
  "arcane_surge": {
    id: "arcane_surge", name: "魔力洪流", type: "passive", category: "special",
    desc: "每回合恢复最大MP的5%。",
    learnReq: { lv: 52, wis: 95 }, buyPrice: 20000, rarity: "legendary"
  },
  "elemental_mastery": {
    id: "elemental_mastery", name: "元素掌控", type: "passive", category: "special",
    desc: "魔法伤害+30%，元素异常几率翻倍。", statBonus: { matkBonus: 30 },
    learnReq: { lv: 60, int: 115 }, buyPrice: 30000, rarity: "legendary"
  },
  "immortal_body": {
    id: "immortal_body", name: "不朽之躯", type: "passive", category: "special",
    desc: "每回合恢复最大HP的5%，受到的持续伤害减半。", statBonus: { hpRegen: 5 },
    learnReq: { lv: 72, vit: 135 }, buyPrice: 50000, rarity: "legendary"
  },
  "void_lord": {
    id: "void_lord", name: "虚空领主", type: "passive", category: "special",
    desc: "击杀敌人时恢复20%HP/MP，并获得攻击+20%持续2回合。",
    learnReq: { lv: 86 }, buyPrice: 85000, rarity: "legendary"
  },
};

// ================================================================
// 技能槽位规则 — 随等级递增
// ================================================================
function getActiveSkillSlots(charLv) {
  if (charLv >= 80) return 6;
  if (charLv >= 60) return 5;
  if (charLv >= 40) return 4;
  if (charLv >= 25) return 3;
  if (charLv >= 10) return 2;
  return 1;
}

function getMaxPassiveSlots(charLv) {
  return 2; // 被动技能槽固定为2，不随等级增加
}

// 获取玩家当前等级可学习的所有技能(排除已学的)
function getLearnableSkills(playerLevel, learnedActive, learnedPassive) {
  const learned = new Set([...learnedActive.map(s => s.skillId), ...learnedPassive.map(s => s.skillId)]);
  const result = { active: [], passive: [] };

  for (const [id, def] of Object.entries(ALL_SKILLS)) {
    if (learned.has(id)) continue;
    const reqLv = def.learnReq?.lv || 1;
    if (reqLv <= playerLevel) {
      if (def.type === "active") result.active.push(id);
      else result.passive.push(id);
    }
  }

  // 按等级要求排序
  const sortFn = (a, b) => (ALL_SKILLS[a].learnReq?.lv || 1) - (ALL_SKILLS[b].learnReq?.lv || 1);
  result.active.sort(sortFn);
  result.passive.sort(sortFn);
  return result;
}

// 获取指定等级段可学习的新技能(用于UI展示 "下一技能: XX级")
function getNextLearnableSkills(playerLevel, learnedActive, learnedPassive) {
  const learned = new Set([...learnedActive.map(s => s.skillId), ...learnedPassive.map(s => s.skillId)]);
  const next = { active: [], passive: [] };

  for (const [id, def] of Object.entries(ALL_SKILLS)) {
    if (learned.has(id)) continue;
    const reqLv = def.learnReq?.lv || 1;
    if (reqLv > playerLevel) {
      if (def.type === "active") next.active.push({ id, lv: reqLv });
      else next.passive.push({ id, lv: reqLv });
    }
  }

  const sortFn = (a, b) => a.lv - b.lv;
  next.active.sort(sortFn);
  next.passive.sort(sortFn);
  return next;
}

// ================================================================
// 职业技能组 — 方便UI按职业推荐
// ================================================================
const PROFESSION_SKILLS = {
  warrior: {
    recommended: ["heavy_strike", "shield_bash", "power_shot", "whirlwind", "sneak_attack",
      "dual_slash", "execute", "armor_break", "rend", "death_strike", "tiger_charge",
      "counter_stance", "endless_storm", "fatal_blow", "doom_slash", "war_god_rage",
      "spatial_slash", "divine_judgment", "apocalypse_blade", "world_breaker"],
    passives: ["muscle_memory", "quick_reflex", "body_hardening", "giant_strength",
      "shadow_step", "iron_body", "titan_power", "storm_rider", "godly_might",
      "transcendence", "omega_perfection", "damage_aura", "defense_aura",
      "speed_aura", "leech_aura", "thorn_aura", "grand_aura", "apocalypse_aura",
      "divine_aura", "undying_will", "immortal_body", "void_lord"]
  },
  mage: {
    recommended: ["fireball", "ice_spike", "heal", "lightning", "dark_bolt",
      "soul_drain", "meteor", "blizzard", "purify", "chain_lightning", "black_hole",
      "time_freeze", "inferno", "elemental_storm", "cataclysm", "astral_projection",
      "spacetime_rift", "void_sphere", "genesis_light", "cosmic_burst"],
    passives: ["brain_training", "spirit_boost", "advanced_scholar", "sage_wisdom",
      "omniscient", "godly_might", "transcendence", "omega_perfection",
      "mp_boost", "magic_aura", "critical_mastery", "grand_aura",
      "apocalypse_aura", "divine_aura", "withering_touch", "fear_presence",
      "double_cast", "arcane_surge", "elemental_mastery", "void_lord"]
  },
  scientist: {
    recommended: ["grenade", "med_kit", "turret", "EMP", "landmine", "nano_repair",
      "mech_summon", "vulcan_cannon", "energy_shield", "tactical_nuke", "bioweapon",
      "antimatter_beam", "orbital_strike", "quantum_teleport", "dimensional_weapon",
      "blackhole_bomb", "reality_rewrite", "omega_weapon"],
    passives: ["brain_training", "endurance", "advanced_scholar", "unlimited_energy",
      "omniscient", "sage_wisdom", "godly_might", "transcendence", "omega_perfection",
      "hp_boost", "mp_boost", "critical_mastery", "elemental_mastery",
      "apocalypse_aura", "divine_aura", "undying_will", "arcane_surge",
      "immortal_body", "void_lord"]
  }
};

// 职业系统
const PROFESSIONS = {
  wanderer: { id: "wanderer", name: "流浪者", icon: "👤", desc: "尚未确定方向的冒险者。", bonuses: {} },
  warrior: { id: "warrior", name: "战士", icon: "⚔️", category: "physical",
    desc: "以物理攻击见长的近战斗士。", bonuses: { atkPct: 10, hpPct: 5 } },
  mage: { id: "mage", name: "法师", icon: "🔮", category: "magic",
    desc: "操控魔法元素的神秘施法者。", bonuses: { matkPct: 10, mpPct: 5 } },
  scientist: { id: "scientist", name: "科学家", icon: "🔬", category: "science",
    desc: "运用科技力量的多面手。", bonuses: { atkPct: 5, matkPct: 5, itemEffectPct: 10 } },
};

function getProfessionBySkill(skillId) {
  if (!skillId) return PROFESSIONS.wanderer;
  const skill = ALL_SKILLS[skillId];
  if (!skill || skill.type !== "active") return PROFESSIONS.wanderer;
  if (skill.category === "physical") return PROFESSIONS.warrior;
  if (skill.category === "magic") return PROFESSIONS.mage;
  if (skill.category === "science") return PROFESSIONS.scientist;
  return PROFESSIONS.wanderer;
}

function skillCategoryName(cat) {
  const map = {
    physical: "物理系", magic: "魔法系", science: "科学系",
    stat_boost: "属性提升", aura: "战斗光环", special: "特殊被动"
  };
  return map[cat] || cat;
}
