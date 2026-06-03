// ===== 任务数据 =====

// ==================== 主线任务：10大章节 ====================
const MAIN_QUEST_CHAPTERS = [
  // ===== 第一章：废土觉醒 (Lv 1-6) =====
  {
    id: "ch1", name: "第一章：废土觉醒", icon: "🌅",
    desc: "从废墟中醒来，证明自己的生存能力，在废土上站稳脚跟。",
    quests: [
      {
        id: "mq_1_1", name: "废墟中醒来", type: "main", chapter: 1,
        giver: "废墟幸存者老赵", giverCity: "北京",
        desc: "核战后150年，你从北京废墟中醒来。老赵给了你一些基本物资，让你击败3个敌人证明自己能活下去。",
        objectives: [{ type: "kill", count: 3, desc: "击败敌人 0/3" }],
        rewards: { exp: 60, gold: 30, items: ["health_potion_s"] },
        rewardText: "老赵点了点头：'不错，你还活着。这瓶药水拿着，活下去才有希望。'",
        minLv: 1, nextQuest: "mq_1_2"
      },
      {
        id: "mq_1_2", name: "收集废金属", type: "main", chapter: 1,
        giver: "拾荒者老王", giverCity: "北京",
        desc: "拾荒者老王告诉你废金属是废土上最重要的资源。收集5个废金属交给他。",
        objectives: [{ type: "collect", item: "scrap_metal", count: 5, desc: "收集废金属 0/5" }],
        rewards: { exp: 100, gold: 60, materials: [{ id: "steel_ingot", qty: 2 }] },
        rewardText: "老王接过废金属，在手上掂了掂：'纯度不错。这几块钢锭是我炼的，你拿着用。'",
        minLv: 1, nextQuest: "mq_1_3"
      },
      {
        id: "mq_1_3", name: "寻找城市", type: "main", chapter: 1,
        giver: "拾荒者老王", giverCity: "北京",
        desc: "老王说附近有幸存者建立的城市。前往并访问1个城市，回来后向他描述外面的世界。",
        objectives: [{ type: "visit_city", count: 1, desc: "访问城市 0/1" }],
        rewards: { exp: 150, gold: 100, items: ["mana_potion_s", "bandage"] },
        rewardText: "老王听完你的描述，眼中闪过希望的光芒：'看来外面还有活路。这些补给你拿着，继续探索吧。'",
        minLv: 1, nextQuest: "mq_1_4"
      },
      {
        id: "mq_1_4", name: "铁匠的委托", type: "main", chapter: 1,
        giver: "铁匠李大锤", giverCity: "北京",
        desc: "铁匠李大锤正愁没有材料打造装备。收集8个废金属和3个钢锭交给他。",
        objectives: [
          { type: "collect", item: "scrap_metal", count: 8, desc: "收集废金属 0/8" },
          { type: "collect", item: "steel_ingot", count: 3, desc: "收集钢锭 0/3" }
        ],
        rewards: { exp: 250, gold: 150, items: ["steel_sword"] },
        rewardText: "李大锤抡起铁锤，火星四溅。片刻后，一柄崭新的钢剑递到你面前：'试试这个，比你的锈剑强多了。'",
        minLv: 2, nextQuest: "mq_1_5"
      },
      {
        id: "mq_1_5", name: "清除鼠害", type: "main", chapter: 1,
        giver: "农民老李", giverCity: "北京",
        desc: "农民老李的庄稼被变异鼠群毁了。消灭8只变异鼠，为民除害。",
        objectives: [{ type: "kill_specific", enemy: "mutant_rat", count: 8, desc: "消灭变异鼠 0/8" }],
        rewards: { exp: 200, gold: 120, items: ["health_potion_m", "bandage"] },
        rewardText: "老李从地里刨出几根还算完好的萝卜，和一包药膏一起塞给你：'多谢了，小伙子！'",
        minLv: 3, nextQuest: "mq_1_6"
      },
      {
        id: "mq_1_6", name: "自我提升", type: "main", chapter: 1,
        giver: "守卫队长周铁", giverCity: "北京",
        desc: "守卫队长周铁看了你一眼：'你这身板还需要锻炼。'提升角色等级到5级，证明自己的成长。",
        objectives: [{ type: "level", count: 5, desc: "角色等级达到 0/5" }],
        rewards: { exp: 300, gold: 200, items: ["combat_armor"] },
        rewardText: "周铁拍了拍你的肩膀：'有点样子了。穿上这件护甲，废土可不是闹着玩的。'",
        minLv: 3, nextQuest: "mq_1_7"
      },
      {
        id: "mq_1_7", name: "初次战斗考验", type: "main", chapter: 1,
        giver: "守卫队长周铁", giverCity: "北京",
        desc: "周铁决定检验你的实战能力。消灭5个废土暴徒，证明你能保护自己。",
        objectives: [{ type: "kill_specific", enemy: "bandit_thug", count: 5, desc: "消灭废土暴徒 0/5" }],
        rewards: { exp: 400, gold: 300, skill_book: "skill_book_heal" },
        rewardText: "周铁收起了严肃的表情，露出难得的笑容：'你合格了。这本治愈术要诀拿去学，活下来才能走得更远。'",
        minLv: 4, nextQuest: "mq_2_1"
      }
    ]
  },

  // ===== 第二章：钢铁之路 (Lv 6-12) =====
  {
    id: "ch2", name: "第二章：钢铁之路", icon: "⚔️",
    desc: "建立声望，消灭匪患，探索地下遗迹的秘密。",
    quests: [
      {
        id: "mq_2_1", name: "匪徒之患", type: "main", chapter: 2,
        giver: "守卫队长周铁", giverCity: "北京",
        desc: "一伙废土暴徒盘踞在商道上，袭击过往的商队。消灭6个暴徒和1个头目，打通商道。",
        objectives: [
          { type: "kill_specific", enemy: "bandit_thug", count: 6, desc: "消灭暴徒 0/6" },
          { type: "kill_specific", enemy: "bandit_leader", count: 1, desc: "消灭头目 0/1" }
        ],
        rewards: { exp: 500, gold: 400, items: ["stimulant"] },
        rewardText: "周铁接过土匪头目的徽章，郑重地行了个军礼：'商道恢复了，城里人都感谢你。'",
        minLv: 5, nextQuest: "mq_2_2"
      },
      {
        id: "mq_2_2", name: "铁匠的订单", type: "main", chapter: 2,
        giver: "铁匠李大锤", giverCity: "北京",
        desc: "李大锤接到了一批守卫队的装备订单，急需材料。收集5个钢锭和3个电路板。",
        objectives: [
          { type: "collect", item: "steel_ingot", count: 5, desc: "收集钢锭 0/5" },
          { type: "collect", item: "circuit_board", count: 3, desc: "收集电路板 0/3" }
        ],
        rewards: { exp: 450, gold: 350, materials: [{ id: "magic_crystal", qty: 2 }] },
        rewardText: "李大锤擦着汗从炉火边走来：'这批装备够守卫队用一阵子了。这两颗魔力水晶是我从废墟里挖到的，送你了。'",
        minLv: 6, nextQuest: "mq_2_3"
      },
      {
        id: "mq_2_3", name: "科技废墟", type: "main", chapter: 2,
        giver: "老学者钱伯", giverCity: "上海",
        desc: "老学者钱伯收到情报，附近有一座战前科技废墟。完成1个副本探索，收集科技遗物。",
        objectives: [{ type: "complete_dungeon", count: 1, desc: "完成副本 0/1" }],
        rewards: { exp: 600, gold: 500, items: ["energy_cell", "energy_cell"] },
        rewardText: "钱伯捧着废墟中找到的数据芯片，双手颤抖：'这……这是战前的AI研究数据！这些能量电池你拿去用。'",
        minLv: 7, nextQuest: "mq_2_4"
      },
      {
        id: "mq_2_4", name: "变异猎手", type: "main", chapter: 2,
        giver: "猎人公会会长雷战", giverCity: "上海",
        desc: "猎人公会悬赏清除变异生物。消灭变异犬5只和变异鼠5只。",
        objectives: [
          { type: "kill_specific", enemy: "mutant_dog", count: 5, desc: "消灭变异犬 0/5" },
          { type: "kill_specific", enemy: "mutant_rat", count: 5, desc: "消灭变异鼠 0/5" }
        ],
        rewards: { exp: 550, gold: 400, stat: "agi" },
        rewardText: "雷战看着猎杀记录，嘿嘿一笑：'身手不错嘛。这瓶敏捷药剂是我从猎人比赛中赢来的，归你了。'",
        minLv: 8, nextQuest: "mq_2_5"
      },
      {
        id: "mq_2_5", name: "废土快递", type: "main", chapter: 2,
        giver: "商队老板万金", giverCity: "广州",
        desc: "商人万金需要收集各地商情。访问3个不同城市，了解各地的物资价格。",
        objectives: [{ type: "visit_city", count: 3, desc: "访问城市 0/3" }],
        rewards: { exp: 500, gold: 600, materials: [{ id: "energy_cell", qty: 3 }] },
        rewardText: "万金翻看着你收集的各地商情记录，小眼睛笑得眯成一条线：'好！这些情报比金子还值钱！'",
        minLv: 9, nextQuest: "mq_2_6"
      },
      {
        id: "mq_2_6", name: "守卫的考验", type: "main", chapter: 2,
        giver: "守卫队长周铁", giverCity: "北京",
        desc: "周铁说拾荒者里混进了不少亡命之徒。消灭5个敌对拾荒者，保护周边安全。",
        objectives: [{ type: "kill_specific", enemy: "scavenger", count: 5, desc: "消灭拾荒者 0/5" }],
        rewards: { exp: 650, gold: 450, items: ["mana_potion_m", "mana_potion_m"] },
        rewardText: "周铁巡视了周边区域，对你竖起了大拇指：'干净利落。这些法力药剂是法师公会送来的，我用不上。'",
        minLv: 10, nextQuest: "mq_2_7"
      },
      {
        id: "mq_2_7", name: "通往南方", type: "main", chapter: 2,
        giver: "通讯工程师陈星", giverCity: "上海",
        desc: "陈星截获了一段来自南方的加密信号。累计移动200公里，沿途追踪信号来源。",
        objectives: [{ type: "travel", count: 200, desc: "累计移动距离 0/200 km" }],
        rewards: { exp: 700, gold: 500, skill_book: "skill_book_fireball" },
        rewardText: "陈星根据你沿途收集的信号强度变化，成功定位了信号源——在海的另一边。'这本火球术秘卷是我从废墟里找到的，路上用得着。'",
        minLv: 11, nextQuest: "mq_3_1"
      }
    ]
  },

  // ===== 第三章：暗潮涌动 (Lv 12-18) =====
  {
    id: "ch3", name: "第三章：暗潮涌动", icon: "🌊",
    desc: "追踪神秘信号，准备跨越海洋，面对更强大的敌人。",
    quests: [
      {
        id: "mq_3_1", name: "科学家的请求", type: "main", chapter: 3,
        giver: "老学者钱伯", giverCity: "上海",
        desc: "钱伯需要能量电池和电路板来建造一台信号放大器。收集5个能量电池和3个电路板。",
        objectives: [
          { type: "collect", item: "energy_cell", count: 5, desc: "收集能量电池 0/5" },
          { type: "collect", item: "circuit_board", count: 3, desc: "收集电路板 0/3" }
        ],
        rewards: { exp: 700, gold: 500, materials: [{ id: "tech_part", qty: 2 }] },
        rewardText: "钱伯启动了信号放大器，显示屏上跳动着清晰的波形：'信号来自一片未知大陆……你需要一艘船。'",
        minLv: 12, nextQuest: "mq_3_2"
      },
      {
        id: "mq_3_2", name: "黑暗中的光芒", type: "main", chapter: 3,
        giver: "商队老板万金", giverCity: "广州",
        desc: "万金说建造远航船只需要在各大城市筹措资源。访问3个不同规模≥2的城市。",
        objectives: [{ type: "visit_city", count: 3, desc: "访问城市 0/3" }],
        rewards: { exp: 600, gold: 600, items: ["health_potion_m", "health_potion_m"] },
        rewardText: "万金将各城的资源清单整理好，拍了拍你的肩膀：'造船的事我来张罗，你先去准备自己的装备。'",
        minLv: 12, nextQuest: "mq_3_3"
      },
      {
        id: "mq_3_3", name: "机械威胁", type: "main", chapter: 3,
        giver: "守卫队长周铁", giverCity: "北京",
        desc: "一支失控的突击机甲在废土上游荡。击败1个突击机甲，解除威胁。",
        objectives: [{ type: "kill_specific", enemy: "assault_mech", count: 1, desc: "消灭突击机甲 0/1" }],
        rewards: { exp: 900, gold: 700, items: ["stimulant", "antidote"] },
        rewardText: "周铁看着机甲残骸，倒吸一口凉气：'你居然单挑了这玩意？好家伙，有你的！'",
        minLv: 14, nextQuest: "mq_3_4"
      },
      {
        id: "mq_3_4", name: "深层遗迹", type: "main", chapter: 3,
        giver: "老学者钱伯", giverCity: "上海",
        desc: "钱伯对比了信号和一份古代地图，发现信号源指向一处地下遗迹。完成2个副本探索。",
        objectives: [{ type: "complete_dungeon", count: 2, desc: "完成副本 0/2" }],
        rewards: { exp: 900, gold: 700, materials: [{ id: "magic_crystal", qty: 5 }, { id: "dark_essence", qty: 2 }] },
        rewardText: "钱伯将两份遗迹数据交叉比对，一个惊人的秘密浮出水面：远古文明可能还活着。",
        minLv: 15, nextQuest: "mq_3_5"
      },
      {
        id: "mq_3_5", name: "变异体猎杀", type: "main", chapter: 3,
        giver: "猎人公会会长雷战", giverCity: "上海",
        desc: "雷战说变异战士出现在上海附近，极度危险。消灭5个变异战士。",
        objectives: [{ type: "kill_specific", enemy: "mutant_warrior", count: 5, desc: "消灭变异战士 0/5" }],
        rewards: { exp: 800, gold: 600, stat: "str" },
        rewardText: "雷战验过变异战士的腺体，神色凝重：'它们越来越强了。这瓶力量药剂你也别推辞。'",
        minLv: 16, nextQuest: "mq_3_6"
      },
      {
        id: "mq_3_6", name: "出航准备", type: "main", chapter: 3,
        giver: "港口管理员郑海", giverCity: "上海",
        desc: "郑海已经准备好了船只，但需要最后一批物资。赚取2000金币（不含已有）作为航海资金。",
        objectives: [{ type: "gold_earn", count: 2000, desc: "赚取金币 0/2000" }],
        rewards: { exp: 800, gold: 800, items: ["ship"] },
        rewardText: "郑海收了你的金币，将一艘中型帆船的钥匙拍在桌上：'她是你的了。善待她——海洋不会善待弱者。'",
        minLv: 17, nextQuest: "mq_3_7"
      },
      {
        id: "mq_3_7", name: "启航", type: "main", chapter: 3,
        giver: "港口管理员郑海", giverCity: "上海",
        desc: "一切准备就绪。购买一艘船（若尚无），然后在海上航行200像素距离，开始你的海洋征途。",
        objectives: [
          { type: "sea_travel", count: 200, desc: "海上航行距离 0/200" },
          { type: "visit_city", count: 1, desc: "访问海外城市 0/1" }
        ],
        rewards: { exp: 1000, gold: 800, materials: [{ id: "gold_coin", qty: 5 }] },
        rewardText: "郑海站在码头目送你远航，海风吹动他花白的头发：'一路顺风，废土的勇士！'",
        require: ["boat"], minLv: 18, nextQuest: "mq_4_1"
      }
    ]
  },

  // ===== 第四章：海洋征途 (Lv 18-24) =====
  {
    id: "ch4", name: "第四章：海洋征途", icon: "⛵",
    desc: "穿越浩瀚海洋，访问海外大陆，揭开信号背后的秘密。",
    quests: [
      {
        id: "mq_4_1", name: "海上航路", type: "main", chapter: 4,
        giver: "老水手海狼", giverCity: "新加坡",
        desc: "新加坡的老水手海狼知道穿越海洋的安全航线。在海上累计航行400像素距离证明你的航海能力。",
        objectives: [{ type: "sea_travel", count: 400, desc: "海上航行距离 0/400" }],
        rewards: { exp: 1000, gold: 700, items: ["health_potion_l", "mana_potion_l"] },
        rewardText: "海狼看着你的航海日志，咧嘴笑了，露出一口金牙：'好水手！来，这瓶朗姆……不对，这瓶药剂给你解渴。'",
        minLv: 18, nextQuest: "mq_4_2", require: ["boat"]
      },
      {
        id: "mq_4_2", name: "海外城市", type: "main", chapter: 4,
        giver: "老水手海狼", giverCity: "新加坡",
        desc: "访问3个海外城市（不在中国大陆的城市），收集各地关于神秘信号的情报。",
        objectives: [{ type: "visit_city", count: 3, desc: "访问海外城市 0/3" }],
        rewards: { exp: 1200, gold: 900, materials: [{ id: "magic_crystal", qty: 3 }] },
        rewardText: "海狼翻看着你带回的情报，在航海图上画满了标记：'信号越来越清晰了，就在西边的大陆。'",
        minLv: 19, nextQuest: "mq_4_3", require: ["boat"]
      },
      {
        id: "mq_4_3", name: "幽灵船之谜", type: "main", chapter: 4,
        giver: "老水手海狼", giverCity: "新加坡",
        desc: "海狼讲起了幽灵船的传说——据说那是一艘载满宝藏的战前军舰。在海上航行600像素距离寻找线索。",
        objectives: [{ type: "sea_travel", count: 600, desc: "海上航行距离 0/600" }],
        rewards: { exp: 1400, gold: 1000, stat: "vit" },
        rewardText: "海狼眯眼看着海平线：'你没找到幽灵船，但你的航海技艺已经超越了大多数老水手。这瓶活力药剂是来自海洋的馈赠。'",
        minLv: 20, nextQuest: "mq_4_4", require: ["boat"]
      },
      {
        id: "mq_4_4", name: "深海猎手", type: "main", chapter: 4,
        giver: "老水手海狼", giverCity: "新加坡",
        desc: "深海有利维坦在守护着什么。击败1只深海利维坦，看看它守护的究竟是什么。",
        objectives: [{ type: "kill_specific", enemy: "leviathan", count: 1, desc: "消灭利维坦 0/1" }],
        rewards: { exp: 2500, gold: 2000, materials: [{ id: "leviathan_scale", qty: 5 }, { id: "ocean_core", qty: 1 }] },
        rewardText: "海狼摸着利维坦的鳞片，震惊得说不出话。半晌才找到声音：'你……你居然真的做到了！这海洋之心是利维坦的力量之源，收好！'",
        minLv: 22, nextQuest: "mq_4_5", require: ["boat"]
      },
      {
        id: "mq_4_5", name: "新大陆", type: "main", chapter: 4,
        giver: "港口管理员郑海", giverCity: "上海",
        desc: "信号源就在前方的大陆。完成2个副本探索，寻找信号源的具体位置。",
        objectives: [{ type: "complete_dungeon", count: 2, desc: "完成副本 0/2" }],
        rewards: { exp: 1600, gold: 1200, items: ["combat_armor"] },
        rewardText: "你在遗迹深处找到了信号源——一台仍在运转的战前通讯设备，屏幕上闪烁着一行字：'我们还在等待……'",
        minLv: 23, nextQuest: "mq_4_6"
      },
      {
        id: "mq_4_6", name: "大陆探索", type: "main", chapter: 4,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "雷战在纽约建立了新的猎人公会分会。访问3个美洲城市，了解这片大陆的情况。",
        objectives: [{ type: "visit_city", count: 3, desc: "访问城市 0/3" }],
        rewards: { exp: 1500, gold: 1100, items: ["stimulant", "stimulant"] },
        rewardText: "雷战摊开了美洲地图，在上面圈出了几个关键位置：'这片大陆比我们想象的更危险——也更有价值。'",
        minLv: 23, nextQuest: "mq_4_7"
      },
      {
        id: "mq_4_7", name: "跨洋霸主", type: "main", chapter: 4,
        giver: "老水手海狼", giverCity: "新加坡",
        desc: "听说你能击败利维坦，海狼给了你最后一个挑战：击败任意30个敌人，以跨洋霸主的身份证明自己。",
        objectives: [{ type: "kill", count: 30, desc: "击败敌人 0/30" }],
        rewards: { exp: 2000, gold: 1500, skill_book: "skill_book_whirlwind" },
        rewardText: "海狼哈哈大笑：'跨洋霸主！这个名字会在每个港口传唱。这本旋风斩剑谱是我年轻时在军舰上找到的，现在它是你的了。'",
        minLv: 24, nextQuest: "mq_5_1"
      }
    ]
  },

  // ===== 第五章：异域大陆 (Lv 24-30) =====
  {
    id: "ch5", name: "第五章：异域大陆", icon: "🗺️",
    desc: "探索新大陆，狩猎巨兽，收集传说资源。",
    quests: [
      {
        id: "mq_5_1", name: "巨兽猎手", type: "main", chapter: 5,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "雷战发布了最高级别的悬赏——死亡爪，这片大陆上最可怕的掠食者。击败1只死亡爪。",
        objectives: [{ type: "kill_specific", enemy: "deathclaw", count: 1, desc: "消灭死亡爪 0/1" }],
        rewards: { exp: 2500, gold: 2000, materials: [{ id: "deathclaw_claw", qty: 5 }, { id: "dragon_scale", qty: 2 }] },
        rewardText: "雷战将死亡爪的头颅挂在公会大厅的墙上，向所有猎人宣布：'这位就是独自猎杀死亡爪的勇士！'",
        minLv: 25, nextQuest: "mq_5_2"
      },
      {
        id: "mq_5_2", name: "猎人试炼", type: "main", chapter: 5,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "猎人公会有个传统：通过试炼才能成为精英猎人。击败任意20个敌人和3个变异战士。",
        objectives: [
          { type: "kill", count: 20, desc: "击败敌人 0/20" },
          { type: "kill_specific", enemy: "mutant_warrior", count: 3, desc: "消灭变异战士 0/3" }
        ],
        rewards: { exp: 2000, gold: 1500, stat: "str" },
        rewardText: "雷战亲手将精英猎人的徽章别在你胸前：'从现在起，你可以在任何猎人公会享受最高待遇。'",
        minLv: 26, nextQuest: "mq_5_3"
      },
      {
        id: "mq_5_3", name: "科技猎手", type: "main", chapter: 5,
        giver: "机械工程师艾米", giverCity: "旧金山",
        desc: "艾米需要大量材料修复一座战前发电站。收集8个高科技零件和5个能量电池。",
        objectives: [
          { type: "collect", item: "tech_part", count: 8, desc: "收集高科技零件 0/8" },
          { type: "collect", item: "energy_cell", count: 5, desc: "收集能量电池 0/5" }
        ],
        rewards: { exp: 2200, gold: 1800, skill_book: "skill_book_med_kit" },
        rewardText: "发电站重新启动的轰鸣声响彻整片区域，周围数公里的灯光次第亮起。艾米激动得跳了起来：'成功了！这张医疗装置图纸给你——它能救很多人的命。'",
        minLv: 27, nextQuest: "mq_5_4"
      },
      {
        id: "mq_5_4", name: "远古遗迹", type: "main", chapter: 5,
        giver: "考古学家林博士", giverCity: "伦敦",
        desc: "林博士发现美洲大陆上有远古文明的遗迹。完成3个副本探索，帮她收集文物。",
        objectives: [{ type: "complete_dungeon", count: 3, desc: "完成副本 0/3" }],
        rewards: { exp: 3000, gold: 2500, materials: [{ id: "magic_crystal", qty: 8 }] },
        rewardText: "林博士将文物拼凑起来，描绘出一幅震惊的画面：远古文明曾统治全球，而他们的敌人——废土巨龙的祖先——导致了他们的衰落。",
        minLv: 28, nextQuest: "mq_5_5"
      },
      {
        id: "mq_5_5", name: "霸主猎杀", type: "main", chapter: 5,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "雷战的终极挑战：击败2只死亡爪和5个突击机甲。只有最强者才能完成。",
        objectives: [
          { type: "kill_specific", enemy: "deathclaw", count: 2, desc: "消灭死亡爪 0/2" },
          { type: "kill_specific", enemy: "assault_mech", count: 5, desc: "消灭突击机甲 0/5" }
        ],
        rewards: { exp: 4000, gold: 3000, skill_book: "skill_book_execute" },
        rewardText: "雷战拍着桌子站起身：'我当了二十年会长，从没见过像你这样的猎人！这本斩杀技要义是我压箱底的宝贝，配得上你。'",
        minLv: 29, nextQuest: "mq_5_6"
      },
      {
        id: "mq_5_6", name: "传说之始", type: "main", chapter: 5,
        giver: "考古学家林博士", giverCity: "伦敦",
        desc: "林博士相信传说级别的武器碎片散落在世界各地。收集5个传说武器碎片。",
        objectives: [{ type: "collect", item: "legendary_weapon", count: 5, desc: "收集传说武器碎片 0/5" }],
        rewards: { exp: 3500, gold: 2800, stat: "int" },
        rewardText: "林博士将五枚碎片放在文物比对仪下，屏幕上显示出古老的锻造配方：'这些碎片来自同一把武器——远古屠龙者的佩剑！'",
        minLv: 29, nextQuest: "mq_5_7"
      },
      {
        id: "mq_5_7", name: "大陆之巅", type: "main", chapter: 5,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "你在美洲大陆的冒险暂时告一段落。访问5个不同大陆的城市，收集全球情报。",
        objectives: [{ type: "visit_city", count: 5, desc: "访问城市 0/5" }],
        rewards: { exp: 3000, gold: 2500, materials: [{ id: "dragon_scale", qty: 5 }, { id: "circuit_board", qty: 5 }] },
        rewardText: "雷战看着你手上的世界地图，上面已经密密麻麻写满了笔记：'你已经走过了大半个世界。关于那条龙——你是时候去欧洲了。'",
        minLv: 30, nextQuest: "mq_6_1"
      }
    ]
  },

  // ===== 第六章：远古之谜 (Lv 30-36) =====
  {
    id: "ch6", name: "第六章：远古之谜", icon: "📜",
    desc: "追寻远古文明的足迹，揭示巨龙与末日之间的联系。",
    quests: [
      {
        id: "mq_6_1", name: "文明探源", type: "main", chapter: 6,
        giver: "考古学家林博士", giverCity: "伦敦",
        desc: "林博士的研究指向欧洲——远古文明的核心区域。访问3个规模≥4的欧洲城市，收集远古文明的线索。",
        objectives: [{ type: "visit_city", count: 3, desc: "访问大城 0/3" }],
        rewards: { exp: 3000, gold: 2500, stat: "wis" },
        rewardText: "林博士对比了欧洲三大城市的遗迹记载，发现远古文明曾建立了一个横跨全球的能量网络——而这网络的中心，正是巨龙巢穴的所在地。",
        minLv: 30, nextQuest: "mq_6_2"
      },
      {
        id: "mq_6_2", name: "远古文字", type: "main", chapter: 6,
        giver: "考古学家林博士", giverCity: "伦敦",
        desc: "林博士需要更多文物来破译远古文字。完成3个副本探索，寻找刻有远古文字的文物。",
        objectives: [{ type: "complete_dungeon", count: 3, desc: "完成副本 0/3" }],
        rewards: { exp: 3500, gold: 2800, skill_book: "skill_book_lightning" },
        rewardText: "林博士终于破译了关键的一段文字：'当巨龙再次苏醒，远古的守护者将从长眠中归来，指引被选中的人——'她激动地将闪电术奥义递给你。",
        minLv: 31, nextQuest: "mq_6_3"
      },
      {
        id: "mq_6_3", name: "学者的请求", type: "main", chapter: 6,
        giver: "生物学家莫教授", giverCity: "东京",
        desc: "莫教授在研究变异生物的起源。收集5个变异腺体、5个暗影精华和3个辐射核心。",
        objectives: [
          { type: "collect", item: "mutant_gland", count: 5, desc: "收集变异腺体 0/5" },
          { type: "collect", item: "dark_essence", count: 5, desc: "收集暗影精华 0/5" },
          { type: "collect", item: "radiated_core", count: 3, desc: "收集辐射核心 0/3" }
        ],
        rewards: { exp: 3500, gold: 2800, materials: [{ id: "magic_crystal", qty: 8 }, { id: "tech_part", qty: 5 }] },
        rewardText: "莫教授将样本放入分析仪，屏幕上显示出惊人的结果：'变异不是偶然的——是巨龙散发的辐射导致了生物变异！它是所有变异的源头！'",
        minLv: 32, nextQuest: "mq_6_4"
      },
      {
        id: "mq_6_4", name: "守护者之试炼", type: "main", chapter: 6,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "在雅典的远古石碑前，守护者迪亚现身了。她说只有通过试炼才能获得屠龙的资格。消灭10个发光食尸鬼和1只死亡爪。",
        objectives: [
          { type: "kill_specific", enemy: "glowing_ghoul", count: 10, desc: "消灭发光食尸鬼 0/10" },
          { type: "kill_specific", enemy: "deathclaw", count: 1, desc: "消灭死亡爪 0/1" }
        ],
        rewards: { exp: 4000, gold: 3000, stat: "ene" },
        rewardText: "迪亚将手按在石碑上，古老的符文次第亮起：'你通过了试炼。远古守护者的力量将与你同在。'",
        minLv: 33, nextQuest: "mq_6_5"
      },
      {
        id: "mq_6_5", name: "远古科技", type: "main", chapter: 6,
        giver: "机械工程师艾米", giverCity: "旧金山",
        desc: "艾米认为远古文明掌握着超越现代的科技。收集10个电路板和5个高科技零件来组装一台远古科技解析器。",
        objectives: [
          { type: "collect", item: "circuit_board", count: 10, desc: "收集电路板 0/10" },
          { type: "collect", item: "tech_part", count: 5, desc: "收集高科技零件 0/5" }
        ],
        rewards: { exp: 4000, gold: 3200, items: ["energy_cell", "energy_cell", "energy_cell", "energy_cell", "energy_cell"] },
        rewardText: "解析器成功启动了远古科技的核心模块，一个全息投影出现在空中——远古文明留下的最后信息：'小心巨龙，它比你们想象的更强大。'",
        minLv: 34, nextQuest: "mq_6_6"
      },
      {
        id: "mq_6_6", name: "石碑之谜", type: "main", chapter: 6,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "迪亚告诉你，世界各地的远古石碑都指向同一个坐标。累计移动500公里，探访散落各处的石碑。",
        objectives: [
          { type: "travel", count: 500, desc: "累计移动距离 0/500 km" },
          { type: "visit_city", count: 3, desc: "访问有石碑的城市 0/3" }
        ],
        rewards: { exp: 4500, gold: 3500, skill_book: "skill_book_soul_drain" },
        rewardText: "迪亚解读了所有石碑的坐标：'巨龙在北极圈的废墟中沉睡。它正在苏醒——我们必须加快速度。这本灵魂汲取禁术，也许能对抗巨龙的魔力。'",
        minLv: 35, nextQuest: "mq_6_7"
      },
      {
        id: "mq_6_7", name: "龙之预言", type: "main", chapter: 6,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "远古预言说：'当巨龙苏醒，世界将再次陷入火海，除非被选中的人举起远古之剑。'击败任意20个敌人，为即将到来的战斗做准备。",
        objectives: [{ type: "kill", count: 20, desc: "击败敌人 0/20" }],
        rewards: { exp: 4000, gold: 3000, materials: [{ id: "dragon_scale", qty: 5 }, { id: "dark_essence", qty: 3 }] },
        rewardText: "迪亚将手放在你的额头上，一股温暖的力量涌入体内：'远古守护者的祝福已降临于你。去收集屠龙所需的材料吧。'",
        minLv: 35, nextQuest: "mq_6_8"
      },
      {
        id: "mq_6_8", name: "远古守护者", type: "main", chapter: 6,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "最终试炼：前往远古守护者的试炼场，证明你有资格继承屠龙者的遗产。完成4个副本探索。",
        objectives: [{ type: "complete_dungeon", count: 4, desc: "完成副本 0/4" }],
        rewards: { exp: 5000, gold: 4000, stat: "str" },
        rewardText: "迪亚单膝跪地，将一枚远古守护者的徽记双手奉上：'你已超越所有前任屠龙者。巨龙的时代该终结了——而你将是终结它的人。'",
        minLv: 36, nextQuest: "mq_7_1"
      }
    ]
  },

  // ===== 第七章：龙之阴影 (Lv 36-42) =====
  {
    id: "ch7", name: "第七章：龙之阴影", icon: "🐉",
    desc: "巨龙的阴影笼罩世界，收集屠龙所需的材料与力量。",
    quests: [
      {
        id: "mq_7_1", name: "巨龙踪迹", type: "main", chapter: 7,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "巨龙的苏醒影响了全球的变异生物——它们变得更加狂暴。击败任意30个敌人，调查巨龙苏醒的影响范围。",
        objectives: [{ type: "kill", count: 30, desc: "击败敌人 0/30" }],
        rewards: { exp: 4500, gold: 3500, materials: [{ id: "mutant_gland", qty: 5 }] },
        rewardText: "雷战看着猎杀记录，眉头越皱越紧：'变异生物的狂暴化正在向全球扩散。那条龙必须被阻止。'",
        minLv: 36, nextQuest: "mq_7_2"
      },
      {
        id: "mq_7_2", name: "龙鳞收集", type: "main", chapter: 7,
        giver: "铁匠李大锤", giverCity: "北京",
        desc: "李大锤说龙鳞是最坚固的锻造材料。收集8个龙鳞，为铸造屠龙武器做准备。",
        objectives: [{ type: "collect", item: "dragon_scale", count: 8, desc: "收集龙鳞 0/8" }],
        rewards: { exp: 5000, gold: 4000, materials: [{ id: "steel_ingot", qty: 10 }] },
        rewardText: "李大锤对着龙鳞敲敲打打，眼中放光：'这材料……我打了一辈子铁，从没见过这么坚固的东西！让我好好研究研究。'",
        minLv: 37, nextQuest: "mq_7_3"
      },
      {
        id: "mq_7_3", name: "邪教徒", type: "main", chapter: 7,
        giver: "教团长老约瑟夫", giverCity: "罗马",
        desc: "约瑟夫长老告诉你，一批崇拜巨龙的邪教徒在世界各地破坏远古石碑。消灭5个土匪头目和10个废土暴徒，阻止他们。",
        objectives: [
          { type: "kill_specific", enemy: "bandit_leader", count: 5, desc: "消灭土匪头目 0/5" },
          { type: "kill_specific", enemy: "bandit_thug", count: 10, desc: "消灭废土暴徒 0/10" }
        ],
        rewards: { exp: 5500, gold: 4500, stat: "ene" },
        rewardText: "约瑟夫在修复的石碑前祈祷：'每一个石碑都是一道封印，保护着世界不被巨龙的力量吞噬。感谢你，勇士。'",
        minLv: 38, nextQuest: "mq_7_4"
      },
      {
        id: "mq_7_4", name: "屠龙武器", type: "main", chapter: 7,
        giver: "铁匠李大锤", giverCity: "北京",
        desc: "李大锤研究出了屠龙武器的锻造配方。收集5个传说武器碎片和5个高科技零件。",
        objectives: [
          { type: "collect", item: "legendary_weapon", count: 5, desc: "收集传说武器碎片 0/5" },
          { type: "collect", item: "tech_part", count: 5, desc: "收集高科技零件 0/5" }
        ],
        rewards: { exp: 6000, gold: 5000, skill_book: "skill_book_meteor" },
        rewardText: "李大锤点燃了熔炉，火焰映红了他的脸。他将一块陨铁投入熔炉，古老的符文在火光中浮现：'这是远古屠龙者的锻造秘法——陨石术！'",
        minLv: 39, nextQuest: "mq_7_5"
      },
      {
        id: "mq_7_5", name: "龙巢探秘", type: "main", chapter: 7,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "迪亚定位了巨龙巢穴的位置——北极冰原下的远古遗迹。完成3个副本探索，探查龙巢周边。",
        objectives: [{ type: "complete_dungeon", count: 3, desc: "完成副本 0/3" }],
        rewards: { exp: 6000, gold: 5000, materials: [{ id: "dragon_scale", qty: 5 }, { id: "dark_essence", qty: 5 }] },
        rewardText: "迪亚通过水晶球观察着龙巢的情况：'巨龙还在沉睡中，但它的仆从们已经察觉到了我们的行动。抓紧时间。'",
        minLv: 40, nextQuest: "mq_7_6"
      },
      {
        id: "mq_7_6", name: "龙之仆从", type: "main", chapter: 7,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "巨龙苏醒的波动让最强大的生物都成为了它的仆从。消灭3只死亡爪和5个突击机甲。",
        objectives: [
          { type: "kill_specific", enemy: "deathclaw", count: 3, desc: "消灭死亡爪 0/3" },
          { type: "kill_specific", enemy: "assault_mech", count: 5, desc: "消灭突击机甲 0/5" }
        ],
        rewards: { exp: 7000, gold: 5500, stat: "vit" },
        rewardText: "雷战清点了战果：'龙之仆从正在减少——这对我们来说是好事。但要面对巨龙本身……你需要更强大的力量。'",
        minLv: 41, nextQuest: "mq_7_7"
      },
      {
        id: "mq_7_7", name: "最后的准备", type: "main", chapter: 7,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "在前往龙巢之前，迪亚要求你做最后的准备。赚取8000金币，收集足够的战斗物资。",
        objectives: [
          { type: "gold_earn", count: 8000, desc: "赚取金币 0/8000" },
          { type: "kill", count: 30, desc: "击败敌人 0/30" }
        ],
        rewards: { exp: 8000, gold: 6000, items: ["health_potion_l", "health_potion_l", "mana_potion_l", "mana_potion_l", "stimulant", "stimulant"] },
        rewardText: "迪亚将一把钥匙交到你手中：'通往北极的远古传送门已经激活。当你准备好的时候，我会在那里等你。'",
        minLv: 42, nextQuest: "mq_8_1"
      }
    ]
  },

  // ===== 第八章：末日真相 (Lv 42-48) =====
  {
    id: "ch8", name: "第八章：末日真相", icon: "🔮",
    desc: "揭开末日战争的真相，了解巨龙与人类之间的古老恩怨。",
    quests: [
      {
        id: "mq_8_1", name: "远古记录", type: "main", chapter: 8,
        giver: "考古学家林博士", giverCity: "伦敦",
        desc: "林博士找到了远古文明末日的关键记录。访问5个城市，在世界各地的图书馆中寻找残页。",
        objectives: [{ type: "visit_city", count: 5, desc: "访问城市 0/5" }],
        rewards: { exp: 7000, gold: 5500, stat: "wis" },
        rewardText: "林博士将收集到的残页拼成一本完整的远古史书：'真相出来了——远古文明在末日战争中制造了巨龙作为生物武器，但巨龙失控了。'",
        minLv: 42, nextQuest: "mq_8_2"
      },
      {
        id: "mq_8_2", name: "战前档案", type: "main", chapter: 8,
        giver: "老学者钱伯", giverCity: "上海",
        desc: "钱伯找到了战前政府的一份秘密档案——与远古文明的研究有关。完成3个副本探索，获取档案。",
        objectives: [{ type: "complete_dungeon", count: 3, desc: "完成副本 0/3" }],
        rewards: { exp: 7500, gold: 6000, skill_book: "skill_book_lightning" },
        rewardText: "钱伯打开了尘封的档案柜，一份泛黄的文件上盖着绝密印章：'核战争不是意外——是人类最后的绝望之举，试图用核弹消灭第一只被制造出来的巨龙。'",
        minLv: 43, nextQuest: "mq_8_3"
      },
      {
        id: "mq_8_3", name: "真相碎片", type: "main", chapter: 8,
        giver: "考古学家林博士", giverCity: "伦敦",
        desc: "真相令人震撼。累计移动800公里，沿途寻找更多证据来验证这一发现。",
        objectives: [{ type: "travel", count: 800, desc: "累计移动距离 0/800 km" }],
        rewards: { exp: 8000, gold: 6500, materials: [{ id: "circuit_board", qty: 10 }] },
        rewardText: "林博士核对了世界各地的史料记录，确认了这个残酷的真相：'末日不是意外，而是人类试图毁灭自己创造的怪物所付出的代价。'",
        minLv: 44, nextQuest: "mq_8_4"
      },
      {
        id: "mq_8_4", name: "最后的石碑", type: "main", chapter: 8,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "迪亚揭示了最后一座石碑的位置——在北极圈内。访问任意5个城市收集通向北极的远古传送钥匙碎片。",
        objectives: [
          { type: "visit_city", count: 5, desc: "访问城市 0/5" },
          { type: "complete_dungeon", count: 2, desc: "完成副本 0/2" }
        ],
        rewards: { exp: 9000, gold: 7000, materials: [{ id: "magic_crystal", qty: 10 }, { id: "dragon_scale", qty: 5 }] },
        rewardText: "迪亚将五枚钥匙碎片合为一体：'传送门已经准备就绪。但在进入龙巢之前，你还需要了解一件事——远古文明留下了一件终极武器。'",
        minLv: 45, nextQuest: "mq_8_5"
      },
      {
        id: "mq_8_5", name: "远古议会", type: "main", chapter: 8,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "远古文明的守护者议会从长眠中苏醒。击败废土巨龙的前任屠龙者——一位堕落的远古守护者（高难度BOSS战）。",
        objectives: [{ type: "kill", count: 50, desc: "击败敌人 0/50" }],
        rewards: { exp: 10000, gold: 8000, stat: "int" },
        rewardText: "远古议会见证了你的战斗，一致同意将远古文明的终极武器托付给你——那是一把能够吸收巨龙力量的传说之剑。",
        minLv: 46, nextQuest: "mq_8_6"
      },
      {
        id: "mq_8_6", name: "末日武器", type: "main", chapter: 8,
        giver: "铁匠李大锤", giverCity: "北京",
        desc: "李大锤按照远古锻造法，开始打造屠龙圣剑。收集传说武器碎片8个、传说防具碎片5个和龙鳞8个。",
        objectives: [
          { type: "collect", item: "legendary_weapon", count: 8, desc: "收集传说武器碎片 0/8" },
          { type: "collect", item: "legendary_armor", count: 5, desc: "收集传说防具碎片 0/5" },
          { type: "collect", item: "dragon_scale", count: 8, desc: "收集龙鳞 0/8" }
        ],
        rewards: { exp: 12000, gold: 10000, materials: [{ id: "legendary_weapon", qty: 3 }, { id: "legendary_armor", qty: 3 }] },
        rewardText: "李大锤在熔炉前奋战了七天七夜。当最后一道淬火完成时，一把闪烁着远古符文光芒的圣剑诞生了：'屠龙圣剑——这把剑就是为了这一天而存在的。'",
        minLv: 47, nextQuest: "mq_8_7"
      },
      {
        id: "mq_8_7", name: "真相大白", type: "main", chapter: 8,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "一切的真相已经揭晓：末日、巨龙、远古文明——它们都指向同一个答案。击败任意40个敌人，完成最后的试炼。",
        objectives: [{ type: "kill", count: 40, desc: "击败敌人 0/40" }],
        rewards: { exp: 10000, gold: 8000, skill_book: "skill_book_meteor" },
        rewardText: "迪亚的眼中闪烁着泪光：'一千年来，无数勇士尝试过屠龙，但没有人走到你这么远。人类的命运，就交给你了。'",
        minLv: 48, nextQuest: "mq_9_1"
      }
    ]
  },

  // ===== 第九章：最终准备 (Lv 48-54) =====
  {
    id: "ch9", name: "第九章：最终准备", icon: "⚡",
    desc: "召集全世界的盟友，锻造最强的装备，准备最后的决战。",
    quests: [
      {
        id: "mq_9_1", name: "召集盟友", type: "main", chapter: 9,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "雷战建议你在全世界召集对抗巨龙的盟友。访问8个不同城市，发出屠龙号召。",
        objectives: [{ type: "visit_city", count: 8, desc: "访问城市 0/8" }],
        rewards: { exp: 10000, gold: 8000, materials: [{ id: "energy_cell", qty: 10 }] },
        rewardText: "雷战亲自联系了世界各地的猎人公会：'只要你发出信号，我们就会在龙巢外围集结——为你分散巨龙的注意力。'",
        minLv: 48, nextQuest: "mq_9_2"
      },
      {
        id: "mq_9_2", name: "终极装备", type: "main", chapter: 9,
        giver: "铁匠李大锤", giverCity: "北京",
        desc: "李大锤要为你打造一整套屠龙装备。收集10个龙鳞、8个传说防具碎片和5个暗影精华。",
        objectives: [
          { type: "collect", item: "dragon_scale", count: 10, desc: "收集龙鳞 0/10" },
          { type: "collect", item: "legendary_armor", count: 8, desc: "收集传说防具碎片 0/8" },
          { type: "collect", item: "dark_essence", count: 5, desc: "收集暗影精华 0/5" }
        ],
        rewards: { exp: 12000, gold: 10000, stat: "vit" },
        rewardText: "李大锤将最后一件护甲递给你，整套屠龙装备闪烁着远古符文的光芒：'穿着这套装备，就算是巨龙也咬不穿你！'",
        minLv: 49, nextQuest: "mq_9_3"
      },
      {
        id: "mq_9_3", name: "大军集结", type: "main", chapter: 9,
        giver: "守卫队长周铁", giverCity: "北京",
        desc: "周铁组织了最后的大练兵。击败任意50个敌人，帮助训练新兵。",
        objectives: [{ type: "kill", count: 50, desc: "击败敌人 0/50" }],
        rewards: { exp: 11000, gold: 9000, stat: "str" },
        rewardText: "周铁看着被训练得井井有条的新兵队伍，感慨万千：'从你第一天来到北京，我就知道你与众不同。去吧，带领我们走向胜利。'",
        minLv: 50, nextQuest: "mq_9_4"
      },
      {
        id: "mq_9_4", name: "最后的训练", type: "main", chapter: 9,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "迪亚要确保你准备好面对巨龙的全部力量。角色等级达到50级，完成4个副本探索。",
        objectives: [
          { type: "level", count: 50, desc: "角色等级达到 0/50" },
          { type: "complete_dungeon", count: 4, desc: "完成副本 0/4" }
        ],
        rewards: { exp: 15000, gold: 12000, stat: "ene" },
        rewardText: "迪亚满意地看着你：'一千年来，没有人达到过你现在的境界。你已经超越了远古文明最强大的战士。'",
        minLv: 50, nextQuest: "mq_9_5"
      },
      {
        id: "mq_9_5", name: "要塞攻略", type: "main", chapter: 9,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "巨龙巢穴外围盘踞着大量仆从。完成5个副本探索，清除龙巢外围的威胁。",
        objectives: [{ type: "complete_dungeon", count: 5, desc: "完成副本 0/5" }],
        rewards: { exp: 14000, gold: 11000, materials: [{ id: "dragon_scale", qty: 10 }, { id: "dark_essence", qty: 5 }] },
        rewardText: "雷战的猎人们报告龙巢外围已经基本清空：'通往龙巢核心的道路已经为你打开了。'",
        minLv: 51, nextQuest: "mq_9_6"
      },
      {
        id: "mq_9_6", name: "巨龙之门", type: "main", chapter: 9,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "迪亚打开了通往巨龙巢穴核心的远古传送门。击败任意30个敌人完成传送门守护者的最后一个试炼。",
        objectives: [{ type: "kill", count: 30, desc: "击败敌人 0/30" }],
        rewards: { exp: 14000, gold: 11000, items: ["health_potion_l", "health_potion_l", "health_potion_l", "mana_potion_l", "mana_potion_l", "stimulant", "stimulant", "stimulant"] },
        rewardText: "传送门在雅典卫城的废墟上缓缓开启，冷冽的北极寒风从门的另一边吹来。迪亚最后一次向你行礼：'我们会在外面守住传送门。人类存亡，在此一举。'",
        minLv: 53, nextQuest: "mq_9_7"
      },
      {
        id: "mq_9_7", name: "决战前夜", type: "main", chapter: 9,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "在踏入传送门之前，你还有最后一个夜晚。赚取10000金币，做好最后的补给准备。",
        objectives: [{ type: "gold_earn", count: 10000, desc: "赚取金币 0/10000" }],
        rewards: { exp: 10000, gold: 15000, items: ["health_potion_l", "health_potion_l", "mana_potion_l", "mana_potion_l"] },
        rewardText: "雅典的夜空下，你回望身后——从废墟中醒来，到站在龙巢门前，一路走来，所有人都相信你会成功。迪亚轻声说：'明天，历史将记住你的名字。'",
        minLv: 54, nextQuest: "mq_10_1"
      }
    ]
  },

  // ===== 第十章：命运之战 (Lv 54-60) =====
  {
    id: "ch10", name: "第十章：命运之战", icon: "🔥",
    desc: "踏入龙巢，面对废土上最强大的存在，书写人类的命运。",
    quests: [
      {
        id: "mq_10_1", name: "踏入龙巢", type: "main", chapter: 10,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "传送门将你带到了北极冰原之下的龙巢入口。击败任意20个敌人，杀出一条血路进入龙巢深处。",
        objectives: [{ type: "kill", count: 20, desc: "击败敌人 0/20" }],
        rewards: { exp: 15000, gold: 12000, materials: [{ id: "dragon_scale", qty: 5 }] },
        rewardText: "穿越传送门的瞬间，刺骨的寒风让你几乎无法呼吸。脚下是万年不化的冰层，远处传来低沉的龙吟——它在等你。",
        minLv: 54, nextQuest: "mq_10_2"
      },
      {
        id: "mq_10_2", name: "突破防线", type: "main", chapter: 10,
        giver: "猎人公会会长雷战", giverCity: "纽约",
        desc: "龙巢中蛰伏着大量龙裔仆从。击败任意30个敌人，突破龙巢的第一道防线。",
        objectives: [{ type: "kill", count: 30, desc: "击败敌人 0/30" }],
        rewards: { exp: 16000, gold: 13000, stat: "str" },
        rewardText: "你击退了潮水般涌来的龙裔仆从，冰窟的地面上散落着远古冒险者的遗骸——他们也曾走到这里，但没能再前进一步。",
        minLv: 55, nextQuest: "mq_10_3"
      },
      {
        id: "mq_10_3", name: "龙之守卫", type: "main", chapter: 10,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "巨龙召唤了它最强大的守卫——死亡爪领主。击败5只死亡爪，它们是龙巢的最后一道防线。",
        objectives: [{ type: "kill_specific", enemy: "deathclaw", count: 5, desc: "消灭死亡爪 0/5" }],
        rewards: { exp: 20000, gold: 16000, materials: [{ id: "deathclaw_claw", qty: 10 }, { id: "dragon_scale", qty: 10 }] },
        rewardText: "最后一只死亡爪在你面前倒下。穿过前方的冰拱门，你看到了它——废土巨龙，盘踞在堆积如山的宝藏之上，一双熔岩般的眼睛正盯着你。",
        minLv: 56, nextQuest: "mq_10_4"
      },
      {
        id: "mq_10_4", name: "决战巨龙", type: "main", chapter: 10,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "废土巨龙就在眼前。击败废土巨龙，终结这个持续了千年的噩梦。这是最后的战斗！",
        objectives: [{ type: "kill_specific", enemy: "wasteland_dragon", count: 1, desc: "消灭废土巨龙 0/1" }],
        rewards: { exp: 50000, gold: 30000, materials: [{ id: "dragon_heart", qty: 1 }, { id: "dragon_scale", qty: 20 }, { id: "legendary_weapon", qty: 10 }] },
        rewardText: "屠龙圣剑刺穿了巨龙的心脏。震耳欲聋的咆哮声回荡在冰窟中，然后——寂静。千年来笼罩废土上空的龙之阴影，终于消散了。",
        minLv: 57, nextQuest: "mq_10_5"
      },
      {
        id: "mq_10_5", name: "龙之心", type: "main", chapter: 10,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "巨龙已死，但它的心脏仍在跳动——其中蕴含着改变世界的力量。收集龙之心（击杀巨龙掉落），决定如何使用它。",
        objectives: [{ type: "collect", item: "dragon_heart", count: 1, desc: "收集龙之心 0/1" }],
        rewards: { exp: 10000, gold: 5000, stat: "int" },
        rewardText: "龙之心在你手中散发着温暖的光芒。迪亚通过传送门的投影出现在你面前：'龙之心可以净化废土，让植物重新生长——或者增幅你的力量。选择权在你。'",
        minLv: 58, nextQuest: "mq_10_6"
      },
      {
        id: "mq_10_6", name: "废土新纪元", type: "main", chapter: 10,
        giver: "远古石碑守护者迪亚", giverCity: "雅典",
        desc: "你选择了净化废土。访问所有你去过的城市，告诉人们巨龙已死，新时代到来了。访问任意10个城市，传播和平的消息。",
        objectives: [{ type: "visit_city", count: 10, desc: "访问城市 0/10" }],
        rewards: { exp: 20000, gold: 20000, items: ["health_potion_l", "health_potion_l", "health_potion_l", "mana_potion_l", "mana_potion_l", "mana_potion_l", "stimulant", "stimulant", "stimulant", "stimulant"] },
        rewardText: "每到一个城市，人们从废墟中走出，仰望天空——核冬天正在消散，第一缕真正的阳光穿透了云层。废土历2198年，巨龙陨落之年，也被后人称为：新生纪元元年。",
        minLv: 59
      }
    ]
  }
];

// 展平主线任务列表
const QUEST_TEMPLATES = [];
for (const ch of MAIN_QUEST_CHAPTERS) {
  for (const q of ch.quests) {
    QUEST_TEMPLATES.push(q);
  }
}

// ==================== 支线任务系统（程序化生成1000+） ====================

// 支线任务发布者池
const SIDE_QUEST_GIVERS = [
  { name: "农民老李", cities: ["北京","成都","武汉","西安"], type: "平民" },
  { name: "拾荒者老王", cities: ["北京","上海","广州","哈尔滨"], type: "拾荒者" },
  { name: "铁匠李大锤", cities: ["北京","大阪","柏林","莫斯科"], type: "工匠" },
  { name: "守卫队长周铁", cities: ["北京","上海","纽约","伦敦"], type: "守卫" },
  { name: "医师白芷", cities: ["成都","重庆","曼谷","拉萨"], type: "医师" },
  { name: "商队老板万金", cities: ["广州","新加坡","迪拜","伊斯坦布尔"], type: "商人" },
  { name: "老水手海狼", cities: ["新加坡","上海","悉尼","洛杉矶"], type: "水手" },
  { name: "猎人公会会长雷战", cities: ["纽约","上海","莫斯科","开普敦"], type: "猎人" },
  { name: "老学者钱伯", cities: ["上海","北京","伦敦","波士顿"], type: "学者" },
  { name: "通讯工程师陈星", cities: ["上海","深圳","东京","旧金山"], type: "工程师" },
  { name: "考古学家林博士", cities: ["伦敦","雅典","开罗","罗马"], type: "学者" },
  { name: "生物学家莫教授", cities: ["东京","新加坡","孟买","圣保罗"], type: "学者" },
  { name: "机械工程师艾米", cities: ["旧金山","柏林","深圳","斯德哥尔摩"], type: "工程师" },
  { name: "教团长老约瑟夫", cities: ["罗马","耶路撒冷","莫斯科","华沙"], type: "神职人员" },
  { name: "神秘剑客无名", cities: ["西安","京都","首尔","拉萨"], type: "武者" },
  { name: "富商金爷", cities: ["迪拜","香港","纽约","伦敦"], type: "商人" },
  { name: "寻宝者马可", cities: ["开罗","伊斯坦布尔","巴格达","卡萨布兰卡"], type: "探险家" },
  { name: "神秘收藏家艾隆", cities: ["莫斯科","巴黎","罗马","维也纳"], type: "收藏家" },
  { name: "港口管理员郑海", cities: ["上海","新加坡","悉尼","阿姆斯特丹"], type: "官员" },
  { name: "药剂师阿加莎", cities: ["伦敦","巴黎","布拉格","雅典"], type: "医师" },
  { name: "赏金猎人杰克", cities: ["纽约","芝加哥","休斯顿","墨西哥城"], type: "猎人" },
  { name: "军火商维克多", cities: ["莫斯科","柏林","华沙","基辅"], type: "商人" },
  { name: "变异人首领格鲁", cities: ["哈尔滨","乌兰巴托","西雅图","渥太华"], type: "变异人" },
  { name: "海盗船长黑胡子", cities: ["新加坡","马尼拉","雅加达","迈阿密"], type: "海盗" },
  { name: "沙漠向导萨拉丁", cities: ["迪拜","利雅得","巴格达","开罗"], type: "向导" },
  { name: "雪原猎人贝尔", cities: ["莫斯科","斯德哥尔摩","赫尔辛基","雷克雅未克"], type: "猎人" },
  { name: "丛林探险家莉娜", cities: ["圣保罗","里约","波哥大","利马"], type: "探险家" },
  { name: "矿山工头老吴", cities: ["珀斯","约翰内斯堡","圣地亚哥","渥太华"], type: "工匠" },
  { name: "渔夫老陈", cities: ["上海","广州","孟买","曼谷"], type: "平民" },
  { name: "牧羊人阿卜杜勒", cities: ["伊斯坦布尔","德黑兰","伊斯兰堡","乌兰巴托"], type: "平民" },
];

// 支线任务类型模板
const SIDE_QUEST_ARCHETYPES = [
  {
    nameTemplates: ["{enemy}讨伐", "清除{enemy}", "{enemy}的威胁", "猎杀{enemy}", "{enemy}灾害"],
    descTemplates: ["{giver}抱怨{enemy}最近活动频繁，影响到了{location}的安宁。消灭{count}只{enemy}。",
                   "最近{location}附近出现了大量{enemy}，{giver}悬赏清除它们。",
                   "{giver}发布了关于{enemy}的通缉令。去干掉{count}只。"],
    objectives: [{ type: "kill_specific", enemy: "{enemy}", count: "{count}", desc: "消灭{enemy} {current}/{count}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["采集{thing}", "收集{thing}", "{thing}的供应", "稀有{thing}征集"],
    descTemplates: ["{giver}急需一批{thing}用于{task}。收集{count}个{thing}交给{giver}。",
                   "{giver}表示愿意出高价收购{count}个{thing}。",
                   "{location}的{giver}希望你帮忙收集{count}个{thing}。"],
    objectives: [{ type: "collect", item: "{item}", count: "{count}", desc: "收集{thing} {current}/{count}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["{location}的委托", "{location}快递", "送货到{location}", "信使之旅"],
    descTemplates: ["{giver}委托你将物资送到各地交易站。访问{count}个城市收集货单。",
                   "为了提高商队效率，{giver}需要了解各城的行情。访问{count}个城市。"],
    objectives: [{ type: "visit_city", count: "{count}", desc: "访问城市 {current}/{count}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["遗迹探险", "地下城攻略", "废墟搜寻", "远古宝藏", "科技废墟探索"],
    descTemplates: ["{giver}告诉你在附近有一座不为人知的遗迹。完成{count}个副本探索。",
                   "一份藏宝图标出了一处地下设施的位置。完成{count}个副本探索寻找宝藏。"],
    objectives: [{ type: "complete_dungeon", count: "{count}", desc: "完成副本 {current}/{count}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["废土巡航", "长途跋涉", "远征{location}", "探索未知"],
    descTemplates: ["{giver}建议你前往更远的地方看看。累计移动{dist}公里。",
                   "一份地图上标注了远方的{location}。移动{dist}公里到达那里。"],
    objectives: [{ type: "travel", count: "{dist}", desc: "累计移动距离 {current}/{dist} km" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["海上探险", "海洋猎手", "远洋航行", "寻找新大陆"],
    descTemplates: ["{giver}听说海外有未被发现的岛屿。在海上航行{dist}像素距离。",
                   "港口的{giver}打赌你不敢独自远航。海上航行{dist}像素距离证明他错了。"],
    objectives: [{ type: "sea_travel", count: "{dist}", desc: "海上航行距离 {current}/{dist}" }],
    rewardPool: "standard",
    require: ["boat"]
  },
  {
    nameTemplates: ["宝箱猎手", "废墟寻宝", "开启宝箱", "寻宝者的委托"],
    descTemplates: ["{giver}说他有一份祖传的藏宝图。找到{count}个宝箱，验证藏宝图的真伪。",
                   "{location}废墟中据说埋藏着很多未被发现的宝箱。找到{count}个。"],
    objectives: [{ type: "find_chest", count: "{count}", desc: "找到宝箱 {current}/{count}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["试炼之路", "武者的挑战", "战斗试炼", "证明实力"],
    descTemplates: ["{giver}想看看你的实力。击败任意{count}个敌人，证明自己。",
                   "酒吧里的{giver}向你发出了挑战。击败{count}个敌人让他闭嘴。"],
    objectives: [{ type: "kill", count: "{count}", desc: "击败敌人 {current}/{count}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["赚取财富", "金币挑战", "商人之道", "财富之证"],
    descTemplates: ["{giver}想看看你的赚钱能力。累计赚取{gold}金币（不算已有）。",
                   "为了证明你的经商头脑，{giver}挑战你赚取{gold}金币。"],
    objectives: [{ type: "gold_earn", count: "{gold}", desc: "赚取金币 {current}/{gold}" }],
    rewardPool: "standard"
  },
  {
    nameTemplates: ["混合挑战", "全能试炼", "多重考验", "综合委托"],
    descTemplates: ["{giver}给了你一个复杂的委托。消灭{count1}只{enemy}并收集{count2}个{thing}。",
                   "这份委托已经积压很久了。{giver}要求消灭{count1}只{enemy}并收集{count2}个{thing}。"],
    objectives: [
      { type: "kill_specific", enemy: "{enemy}", count: "{count1}", desc: "消灭{enemy} {current}/{count1}" },
      { type: "collect", item: "{item}", count: "{count2}", desc: "收集{thing} {current}/{count2}" }
    ],
    rewardPool: "standard"
  },
];

// 敌人池（按等级分组）
const ENEMY_POOL = {
  low: ["mutant_rat", "bandit_thug", "mutant_dog", "scavenger"],
  mid: ["mutant_warrior", "bandit_leader", "glowing_ghoul", "security_bot", "wasteland_mage"],
  high: ["deathclaw", "assault_mech", "toxic_shaman"],
  boss: ["wasteland_dragon", "ancient_ai", "leviathan"],
};

// 物品池
const ITEM_POOL = {
  low: ["scrap_metal", "steel_ingot", "circuit_board", "mutant_gland", "bandage"],
  mid: ["magic_crystal", "energy_cell", "dark_essence", "radiated_core", "tech_part"],
  high: ["legendary_weapon", "legendary_armor", "dragon_scale", "deathclaw_claw", "dragon_heart"],
};

// 物品显示名（用于任务文本）
const ITEM_DISPLAY_NAMES = {
  "scrap_metal": "废金属", "steel_ingot": "钢锭", "circuit_board": "电路板",
  "mutant_gland": "变异腺体", "bandage": "绷带", "magic_crystal": "魔力水晶",
  "energy_cell": "能量电池", "dark_essence": "暗影精华", "radiated_core": "辐射核心",
  "tech_part": "高科技零件", "legendary_weapon": "传说武器碎片",
  "legendary_armor": "传说防具碎片", "dragon_scale": "龙鳞",
  "deathclaw_claw": "死亡爪之爪", "dragon_heart": "龙之心",
  "gold_coin": "金币", "ocean_core": "海洋之心", "leviathan_scale": "利维坦鳞片",
};

// 城市名池（用于任务文本中的虚拟地点名）
const LOCATION_NAMES = [
  "废铁镇", "辐射谷", "商道十字路口", "旧时代的炼油厂", "地下掩体B-12",
  "燃烧的油田", "水处理厂废墟", "末日前的导弹基地", "铁路枢纽三号站",
  "地下医疗中心", "废弃的卫星站", "变异的丛林", "盐碱平原",
  "破碎的高速公路", "旧军事仓库", "毒气沼泽", "巨人骸骨遗迹",
  "锈蚀的铁桥", "枯萎的农田", "干涸的运河", "裂变反应堆",
  "沉没的城市", "瓦砾之丘", "铁锈沙漠", "孢子森林",
];

// 虚拟任务名
const TASK_NAMES = [
  "制药", "锻造装备", "修复设备", "科学研究", "治疗伤者",
  "建造防御工事", "制作弹药", "种植作物", "提炼燃料", "维修车辆",
];

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// 根据玩家等级选取合适难度池
function getTier(playerLv) {
  if (playerLv <= 10) return "low";
  if (playerLv <= 25) return "mid";
  return "high";
}

// 生成程序化支线任务
// count 参数控制生成总数，默认为用于不同等级组合可达1000+
const GENERATED_SIDE_QUESTS_CACHE = {};

function generateSideQuest(playerLv, seed) {
  const tier = getTier(playerLv);
  // 选取合适的模板（排除需要船但玩家没船的）
  const archetype = pickRandom(SIDE_QUEST_ARCHETYPES);
  const giver = pickRandom(SIDE_QUEST_GIVERS);
  const location = pickRandom(LOCATION_NAMES);
  const task = pickRandom(TASK_NAMES);

  // 选取敌人
  const enemyKey = pickRandom(ENEMY_POOL[tier]);
  const enemyTemplate = ENEMY_TEMPLATES[enemyKey];
  const enemyName = enemyTemplate ? enemyTemplate.name : enemyKey;

  // 选取物品
  const itemKey = pickRandom(ITEM_POOL[tier]);
  const itemName = ITEM_DISPLAY_NAMES[itemKey] || itemKey;

  // 生成数量
  const count = randBetween(3, 12);
  const count1 = randBetween(3, 8);
  const count2 = randBetween(3, 8);
  const dist = randBetween(100, 600);
  const goldAmt = randBetween(1000, 8000);

  // 随机奖励
  const rewardType = Math.random();
  let rewards;
  if (rewardType < 0.2) {
    // 技能书奖励
    const skillBooks = ["skill_book_fireball","skill_book_heal","skill_book_lightning","skill_book_whirlwind","skill_book_med_kit","skill_book_execute"];
    rewards = { exp: playerLv * 30 + randBetween(100, 500), gold: playerLv * 20 + randBetween(50, 300), skill_book: pickRandom(skillBooks) };
  } else if (rewardType < 0.35) {
    // 属性药水
    const stats = ["str","agi","int","vit","wis","ene"];
    rewards = { exp: playerLv * 25 + randBetween(100, 400), gold: playerLv * 15 + randBetween(50, 250), stat: pickRandom(stats) };
  } else if (rewardType < 0.55) {
    // 材料奖励
    const matCount = randBetween(1, 3);
    const materials = [];
    for (let i = 0; i < matCount; i++) {
      materials.push({ id: pickRandom(ITEM_POOL[tier]), qty: randBetween(2, 8) });
    }
    rewards = { exp: playerLv * 20 + randBetween(100, 350), gold: playerLv * 15 + randBetween(50, 250), materials };
  } else {
    // 物品奖励
    const itemCount = randBetween(1, 4);
    const items = [];
    const consumables = ["health_potion_s","health_potion_m","mana_potion_s","mana_potion_m","bandage","antidote","stimulant"];
    for (let i = 0; i < itemCount; i++) {
      items.push(pickRandom(consumables));
    }
    rewards = { exp: playerLv * 20 + randBetween(100, 350), gold: playerLv * 15 + randBetween(50, 250), items };
  }

  // 生成任务名
  const nameTemplate = pickRandom(archetype.nameTemplates);
  const name = nameTemplate
    .replace("{enemy}", enemyName)
    .replace("{thing}", itemName)
    .replace("{location}", location);

  // 生成描述
  const descTemplate = pickRandom(archetype.descTemplates);
  const desc = descTemplate
    .replace(/{giver}/g, giver.name)
    .replace(/{enemy}/g, enemyName)
    .replace(/{thing}/g, itemName)
    .replace(/{location}/g, location)
    .replace(/{task}/g, task)
    .replace(/{count}/g, String(count))
    .replace(/{count1}/g, String(count1))
    .replace(/{count2}/g, String(count2))
    .replace(/{dist}/g, String(dist))
    .replace(/{gold}/g, String(goldAmt));

  // 生成目标
  const objectives = JSON.parse(JSON.stringify(archetype.objectives));
  for (const obj of objectives) {
    obj.count = String(obj.count)
      .replace("{count}", String(count))
      .replace("{count1}", String(count1))
      .replace("{count2}", String(count2))
      .replace("{dist}", String(dist))
      .replace("{gold}", String(goldAmt));
    obj.count = parseInt(obj.count) || 5;
    obj.desc = (obj.desc || "")
      .replace("{enemy}", enemyName)
      .replace("{thing}", itemName)
      .replace("{current}", "0")
      .replace("{count}", String(obj.count))
      .replace("{count1}", String(obj.count))
      .replace("{count2}", String(obj.count))
      .replace("{dist}", String(obj.count))
      .replace("{gold}", String(obj.count));
    if (obj.enemy === "{enemy}") obj.enemy = enemyKey;
    if (obj.item === "{item}") obj.item = itemKey;
  }

  // 奖励文本
  const rewardTexts = [
    `"干得好！这是你应得的报酬。"${giver.name}笑着递过奖励。`,
    `"比我想象中快多了。"${giver.name}满意地拿出了酬劳。`,
    `${giver.name}清点了成果，点了点头："不错不错，收下这些吧。"`,
    `"你办事，我放心。"${giver.name}将奖励塞到你手里。`,
    `"要是所有人都像你这么能干，废土早就是天堂了。"${giver.name}感叹道。`,
  ];

  // 用参数组合生成稳定ID，支持重复接取识别
  const baseId = "sq_gen_" + archetype.nameTemplates[0].replace(/[{}]/g, '').substring(0, 8) + "_" + enemyKey + "_" + itemKey + "_" + giver.name.replace(/[^a-zA-Z一-龥]/g, '').substring(0, 4);
  const uniqueId = baseId + "_" + (seed || Date.now()).toString(36);

  const quest = {
    id: uniqueId,
    baseId: baseId, // 用于重复完成检测
    name,
    type: "side",
    giver: giver.name,
    giverCity: pickRandom(giver.cities),
    desc,
    objectives,
    rewards,
    rewardText: pickRandom(rewardTexts),
    minLv: Math.max(1, playerLv - 2),
    repeatable: true,
    generated: true,
  };

  return quest;
}

// 获取程序化支线任务
// 每次调用都生成新任务，通过组合参数确保多样性
function getSideQuest(playerLv, forceNew) {
  // 使用时间戳+玩家等级+随机因子作为种子，确保每次生成不同
  const seed = Date.now() + Math.floor(Math.random() * 1000000) + playerLv * 1000;
  return generateSideQuest(playerLv, seed);
}

// 支线任务列表（用于任务板）
function getBoardSideQuests(playerLv, count) {
  count = count || 5;
  const quests = [];
  for (let i = 0; i < count; i++) {
    quests.push(getSideQuest(playerLv, i % 3 === 0));
  }
  return quests;
}

// 任务板随机任务（保留简单的）
const BOARD_QUESTS = [
  { id: "bq_deliver", name: "快递任务", desc: "将物资送到指定地点（自动完成）。", objectives: [{ type: "auto", count: 1, desc: "运送中..." }],
    giver: "任务板", giverCity: "任意城市",
    rewards: { exp: 100, gold: [60, 150] }, rewardText: "物资已送达，委托人在回执上签了字。", minLv: 1, repeatable: true },
  { id: "bq_bounty", name: "悬赏令", desc: "随机消灭附近出没的怪物。", objectives: [{ type: "kill_any", count: [3, 8], desc: "消灭任意敌人" }],
    giver: "任务板", giverCity: "任意城市",
    rewards: { exp: 200, gold: [100, 300] }, rewardText: "悬赏令发布者对猎杀成果表示满意。", minLv: 3, repeatable: true },
  { id: "bq_scavenge", name: "废墟探索", desc: "探索废墟寻找物资（自动完成）。", objectives: [{ type: "auto", count: 1, desc: "探索中..." }],
    giver: "任务板", giverCity: "任意城市",
    rewards: { exp: 80, gold: [40, 100], items: ["scrap_metal","scrap_metal"] }, rewardText: "搜刮到的物资已上交，管理员点头认可。", minLv: 1, repeatable: true },
  { id: "bq_escort", name: "护送任务", desc: "护送商队穿越危险区域（自动完成）。", objectives: [{ type: "auto", count: 1, desc: "护送中..." }],
    giver: "任务板", giverCity: "任意城市",
    rewards: { exp: 150, gold: [80, 200] }, rewardText: "商队安全到达目的地，队长向你致谢。", minLv: 5, repeatable: true },
  { id: "bq_patrol", name: "巡逻任务", desc: "在城市周边巡逻清理怪物。", objectives: [{ type: "kill_any", count: [5, 10], desc: "消灭任意敌人" }],
    giver: "任务板", giverCity: "任意城市",
    rewards: { exp: 350, gold: [200, 500] }, rewardText: "守卫队长检查了巡逻报告，对你的表现大加赞赏。", minLv: 8, repeatable: true },
  { id: "bq_research", name: "科研协助", desc: "帮科学家收集样本（自动完成）。", objectives: [{ type: "auto", count: 1, desc: "收集中..." }],
    giver: "任务板", giverCity: "任意城市",
    rewards: { exp: 200, gold: [80, 200], items: ["mutant_gland"] }, rewardText: "科学家收到样本后两眼放光，立即开始了实验。", minLv: 6, repeatable: true },
];

// ===== 任务管理器 =====
class QuestManager {
  constructor() {
    this.activeQuests = [];   // 当前进行中的任务
    this.deliveredQuests = []; // 已交付的任务ID
    this.completedCount = {};  // 每个任务ID的完成次数（用于减半机制）
    this.travelDistance = 0;   // 累计旅行距离
    this.goldEarned = 0;       // 累计获得金币（用于统计）
    this.currentChapter = 1;
    this.sideQuestPool = [];   // 当前可用的支线任务池
  }

  acceptQuest(questTemplate) {
    if (this.activeQuests.find(q => q.id === questTemplate.id)) return false;
    // 主线任务不可重复
    if (questTemplate.type === "main" && this.deliveredQuests.includes(questTemplate.id)) return false;

    const quest = JSON.parse(JSON.stringify(questTemplate));
    quest.progress = quest.objectives.map(o => ({ ...o, current: 0 }));
    quest.acceptedAt = Date.now();
    // 使用 baseId（生成任务）或 id 来追踪重复完成次数
    const trackId = quest.baseId || quest.id;
    const doneCount = this.completedCount[trackId] || 0;
    quest.repeatCount = doneCount;
    quest._trackId = trackId;
    this.activeQuests.push(quest);
    // 刷新收集类进度（玩家可能已有物品）
    this.refreshCollectProgress();
    return true;
  }

  updateProgress(type, data, qty) {
    for (const quest of this.activeQuests) {
      for (let i = 0; i < quest.objectives.length; i++) {
        const obj = quest.objectives[i];
        const prog = quest.progress[i];

        if (obj.type === "kill_any" && type === "kill") {
          prog.current = Math.min(obj.count, prog.current + 1);
        } else if (obj.type === "kill_specific" && type === "kill" && data === obj.enemy) {
          prog.current = Math.min(obj.count, prog.current + 1);
        } else if (obj.type === "collect" && type === "collect" && data === obj.item) {
          // 扫描背包中的总数量
          const player = window.playerInstance;
          if (player) {
            const itemCount = player.countItem(obj.item);
            prog.current = Math.min(obj.count, itemCount);
          } else {
            prog.current = Math.min(obj.count, prog.current + (qty || 1));
          }
        } else if (obj.type === "visit_city" && type === "visit_city") {
          prog.current = Math.min(obj.count, prog.current + 1);
        } else if (obj.type === "find_chest" && type === "find_chest") {
          prog.current = Math.min(obj.count, prog.current + 1);
        } else if (obj.type === "complete_dungeon" && type === "complete_dungeon") {
          prog.current = Math.min(obj.count, prog.current + 1);
        } else if (obj.type === "sea_travel" && type === "sea_travel") {
          prog.current = Math.min(obj.count, prog.current + (data || 0));
        } else if (obj.type === "travel" && type === "travel") {
          prog.current = Math.min(obj.count, prog.current + (data || 0));
        } else if (obj.type === "gold_earn" && type === "gold_earn") {
          prog.current = Math.min(obj.count, prog.current + (data || 0));
        } else if (obj.type === "auto" && type === "auto") {
          prog.current = obj.count;
        } else if (obj.type === "kill" && type === "kill") {
          prog.current = Math.min(obj.count, prog.current + 1);
        } else if (obj.type === "level" && type === "level") {
          prog.current = Math.max(prog.current, data || 0);
        }
      }
    }
    this.checkCompletions();
  }

  // 扫描所有当前任务的collect目标，刷新进度
  refreshCollectProgress() {
    for (const quest of this.activeQuests) {
      for (let i = 0; i < quest.objectives.length; i++) {
        const obj = quest.objectives[i];
        const prog = quest.progress[i];
        if (obj.type === "collect" && obj.item) {
          const player = window.playerInstance;
          if (player) {
            prog.current = Math.min(obj.count, player.countItem(obj.item));
          }
        }
      }
    }
  }

  checkCompletions() {
    const completed = [];
    for (const quest of this.activeQuests) {
      const allDone = quest.progress.every((p, i) => p.current >= quest.objectives[i].count);
      if (allDone) completed.push(quest);
    }
    return completed;
  }

  completeQuest(questId) {
    const idx = this.activeQuests.findIndex(q => q.id === questId);
    if (idx < 0) return null;
    const quest = this.activeQuests[idx];
    this.activeQuests.splice(idx, 1);
    this.deliveredQuests.push(quest.id);
    // 使用 _trackId（baseId）进行重复计数
    const trackId = quest._trackId || quest.id;
    this.completedCount[trackId] = (this.completedCount[trackId] || 0) + 1;
    return quest;
  }

  getBoardQuest(playerLv) {
    // 优先从程序化支线池取
    if (Math.random() < 0.7) {
      return getSideQuest(playerLv);
    }
    const available = BOARD_QUESTS.filter(q => q.minLv <= playerLv);
    if (!available.length) return BOARD_QUESTS[0];
    const q = available[Math.floor(Math.random() * available.length)];
    const quest = JSON.parse(JSON.stringify(q));
    for (let i = 0; i < quest.objectives.length; i++) {
      if (Array.isArray(quest.objectives[i].count)) {
        const [min, max] = quest.objectives[i].count;
        quest.objectives[i].count = Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }
    if (Array.isArray(quest.rewards.gold)) {
      const [min, max] = quest.rewards.gold;
      quest.rewards.gold = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    quest.id = quest.id + "_" + Date.now();
    return quest;
  }

  // 获取当前章节信息
  getCurrentChapter(playerLv) {
    for (const ch of MAIN_QUEST_CHAPTERS) {
      if (ch.quests.some(q => q.minLv <= playerLv + 3)) return ch;
    }
    return MAIN_QUEST_CHAPTERS[MAIN_QUEST_CHAPTERS.length - 1];
  }
}

// 全局：生成指定数量支线任务供预览
function generateSideQuestPool(playerLv, size) {
  const pool = [];
  for (let i = 0; i < (size || 100); i++) {
    pool.push(generateSideQuest(playerLv, i * 7919 + 1));
  }
  return pool;
}
