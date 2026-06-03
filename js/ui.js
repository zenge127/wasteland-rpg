// ===== UI管理系统 =====

class UIManager {
  constructor(player, combat, worldMap) {
    this.player = player;
    this.combat = combat;
    this.worldMap = worldMap;

    // 面板切换
    this.currentTab = "tab-actions";
    this.selectedSkillId = null;
    this._invSortMode = "type"; // 默认按类别排序

    this.init();
  }

  init() {
    // 标签切换
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => this.switchTab(btn.dataset.tab));
    });

    // 行动按钮
    this.bindActionButtons();

    // 装备格子点击
    document.querySelectorAll(".equip-slot").forEach(slot => {
      slot.addEventListener("click", () => {
        const slotName = slot.dataset.slot;
        const eq = this.player.equipment[slotName];
        if (eq) {
          this.showEquipDetail(eq, slotName);
        }
      });
    });

    // 初始更新
    this.updateAll();
    setInterval(() => this.updateQuickStats(), 1000);
  }

  bindActionButtons() {
    document.getElementById("btn-explore").addEventListener("click", () => this.actionExplore());
    document.getElementById("btn-rest").addEventListener("click", () => this.actionRest());
    document.getElementById("btn-enter-dungeon").addEventListener("click", () => this.actionEnterDungeon());
    document.getElementById("btn-enter-city").addEventListener("click", () => this.actionEnterCity());
    document.getElementById("btn-auto-explore").addEventListener("click", () => this.actionAutoExplore());
    document.getElementById("btn-multi-explore").addEventListener("click", () => this.actionMultiExplore());
  }

  switchTab(tabId) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel-content").forEach(p => p.classList.remove("active"));

    const tabBtn = document.querySelector(`[data-tab="${tabId}"]`);
    if (tabBtn) tabBtn.classList.add("active");

    const tabContent = document.getElementById(tabId);
    if (tabContent) tabContent.classList.add("active");

    this.currentTab = tabId;
    this.updateTab(tabId);
  }

  updateTab(tabId) {
    switch (tabId) {
      case "tab-character": this.updateCharacterPanel(); break;
      case "tab-skills": this.updateSkillsPanel(); break;
      case "tab-equipment": this.updateEquipmentPanel(); break;
      case "tab-inventory": this.updateInventoryPanel(); break;
      case "tab-quests": this.updateQuestsPanel(); break;
      case "tab-log": this.updateLogPanel(); break;
    }
  }

  // ===== 全量更新 =====
  updateAll() {
    this.updateTopBar();
    this.updateQuickStats();
    this.updateActionPanel();
    this.updateTab(this.currentTab);
  }

  updateTopBar() {
    const cs = this.player.getCombatStats();
    document.getElementById("player-lv").textContent = this.player.lv;
    document.getElementById("player-hp").textContent = cs.hp;
    document.getElementById("player-maxhp").textContent = cs.maxHp;
    document.getElementById("player-mp").textContent = cs.mp;
    document.getElementById("player-maxmp").textContent = cs.maxMp;
    document.getElementById("player-exp").textContent = this.player.freeExp;
    document.getElementById("player-gold").textContent = this.player.gold;
  }

  updateQuickStats() {
    const s = this.player.getStats();
    document.getElementById("qs-str").textContent = s.str;
    document.getElementById("qs-agi").textContent = s.agi;
    document.getElementById("qs-int").textContent = s.int;
    document.getElementById("qs-vit").textContent = s.vit;
    document.getElementById("qs-wis").textContent = s.wis;
    document.getElementById("qs-ene").textContent = s.ene;
  }

  updateActionPanel() {
    const terrain = this.worldMap.getTerrainAtPlayer();
    document.getElementById("action-location").textContent = terrain.terrain || "废土荒野";
    document.getElementById("action-coords").textContent = `坐标: (${terrain.x}, ${terrain.y})`;
    document.getElementById("action-terrain").textContent = `地形: ${terrain.terrain || "未知"}`;

    // 城市进入按钮
    const nearbyCity = this.worldMap.findNearbyCity(3);
    const btnCity = document.getElementById("btn-enter-city");
    if (nearbyCity) {
      btnCity.disabled = false;
      btnCity.textContent = `🏙️ 进入 ${nearbyCity.name}`;
    } else {
      btnCity.disabled = true;
      btnCity.textContent = "🏙️ 附近没有城市";
    }

    // 副本进入按钮
    const nearbyDungeon = this.worldMap.findNearbyDungeon(3);
    const btnDungeon = document.getElementById("btn-enter-dungeon");
    if (nearbyDungeon) {
      btnDungeon.disabled = false;
      btnDungeon.textContent = `🏚️ 进入 ${nearbyDungeon.name}`;
    } else {
      btnDungeon.disabled = true;
      btnDungeon.textContent = "🏚️ 附近没有副本";
    }

    document.getElementById("location-info").textContent = nearbyCity ? nearbyCity.name : (terrain.terrain || "废土荒野");
  }

  updateCharacterPanel() {
    const cs = this.player.getCombatStats();
    const stats = this.player.getStats();
    const prof = this.player.getProfession();

    document.getElementById("cs-lv").textContent = this.player.lv + " · " + prof.icon + " " + prof.name;
    document.getElementById("cs-exp").textContent = `${this.player.exp} / ${this.player.expToNext}`;
    document.getElementById("cs-freeexp").textContent = this.player.freeExp;
    document.getElementById("cs-str").textContent = stats.str;
    document.getElementById("cs-agi").textContent = stats.agi;
    document.getElementById("cs-int").textContent = stats.int;
    document.getElementById("cs-vit").textContent = stats.vit;
    document.getElementById("cs-wis").textContent = stats.wis;
    document.getElementById("cs-ene").textContent = stats.ene;
    document.getElementById("cs-atk").textContent = cs.atk;
    document.getElementById("cs-matk").textContent = cs.matk;
    document.getElementById("cs-def").textContent = cs.def;
    document.getElementById("cs-mdef").textContent = cs.mdef;
    document.getElementById("cs-spd").textContent = cs.spd;
    document.getElementById("cs-dodge").textContent = Math.min(50, Math.floor(cs.dodge)) + "%";
    document.getElementById("cs-crit").textContent = Math.min(80, Math.floor(cs.crit)) + "%";

    // 经验分配
    document.getElementById("ea-free").textContent = this.player.freeExp;
    const amtEl = document.getElementById("ea-amount");
    if (amtEl) {
      amtEl.max = this.player.freeExp;
      if (parseInt(amtEl.value) > this.player.freeExp || parseInt(amtEl.value) <= 0) amtEl.value = Math.min(1, this.player.freeExp);
    }

    // 属性点分配按钮
    let statAllocHtml = '<div style="margin-top:8px;"><p>可用属性点: <b>' + this.player.freeStatPoints + '</b></p><div style="display:flex;flex-wrap:wrap;gap:4px;">';
    for (const stat of ["str","agi","int","vit","wis","ene"]) {
      statAllocHtml += `<button class="btn-small" onclick="window.allocateStatPoint('${stat}')">+1 ${statName(stat)}</button>`;
    }
    statAllocHtml += '</div></div>';
    const expAllocDiv = document.querySelector(".exp-allocation");
    if (expAllocDiv) {
      // 移除旧的属性分配
      const old = expAllocDiv.querySelector(".stat-allocation");
      if (old) old.remove();
      const div = document.createElement("div");
      div.className = "stat-allocation";
      div.innerHTML = statAllocHtml;
      expAllocDiv.appendChild(div);
    }

    // 技能选择下拉
    const sel = document.getElementById("ea-skill-select");
    if (sel) {
      sel.innerHTML = "";
      const allSkills = [...this.player.learnedSkills.active, ...this.player.learnedSkills.passive];
      for (const sk of allSkills) {
        const def = ALL_SKILLS[sk.skillId];
        const opt = document.createElement("option");
        opt.value = sk.skillId;
        opt.textContent = `${def.name} Lv.${sk.lv}`;
        sel.appendChild(opt);
      }
    }
  }

  updateSkillsPanel() {
    const activeSlots = this.player.getActiveSkillSlots();
    const usedActive = this.player.learnedSkills.active.length;
    const usedPassive = this.player.learnedSkills.passive.length;

    document.getElementById("ss-active").textContent = `${usedActive}/${activeSlots}`;
    document.getElementById("ss-passive").textContent = `${usedPassive}/${this.player.getMaxPassiveSlots()}`;
    const elActiveMax = document.getElementById("ss-active-max");
    if (elActiveMax) elActiveMax.textContent = activeSlots;
    const elPassiveMax = document.getElementById("ss-passive-max");
    if (elPassiveMax) elPassiveMax.textContent = this.player.getMaxPassiveSlots();

    // 已学技能
    const learnedDiv = document.getElementById("learned-skills");
    learnedDiv.innerHTML = "";
    const allSkills = [...this.player.learnedSkills.active.map(s => ({ ...s, skillType: "active" })),
                       ...this.player.learnedSkills.passive.map(s => ({ ...s, skillType: "passive" }))];

    if (allSkills.length === 0) {
      learnedDiv.innerHTML = "<p style='color:#5a5a4a'>尚未学习任何技能</p>";
    } else {
      for (const sk of allSkills) {
        const def = ALL_SKILLS[sk.skillId];
        if (!def) continue;
        const card = document.createElement("div");
        const isMain = sk.skillType === "active" && this.player.mainSkillId === sk.skillId;
        card.className = "skill-card" + (this.selectedSkillId === sk.skillId ? " selected" : "") + (isMain ? " main-skill" : "");
        const cdInfo = def.cooldown > 0 ? `<span style="color:#ffa040;">⏳ CD:${def.cooldown}回合</span>` : `<span style="color:#60c060;">⚡ 无冷却</span>`;
        card.innerHTML = `
          <div class="skill-name">${def.name} Lv.${sk.lv} ${isMain ? '<span style="color:#f0c040;font-size:10px;">【主技能】</span>' : (sk.skillType === "active" ? '<span style="color:#5a5a4a;font-size:10px;">【副技能】</span>' : '')}</div>
          <div class="skill-type">${sk.skillType === "active" ? "⚡主动" : "🔮被动"} | ${skillCategoryName(def.category)} | ${cdInfo}</div>
          <div class="skill-desc">${def.desc}</div>
          ${def.mpCost ? `<div class="skill-lv">MP消耗: ${def.mpCost}</div>` : ""}
        `;
        card.addEventListener("click", () => {
          this.selectedSkillId = sk.skillId;
          this.updateSkillsPanel();
        });
        learnedDiv.appendChild(card);
      }
    }

    // 遗忘按钮
    const forgetBtn = document.getElementById("btn-forget-skill");
    if (this.selectedSkillId) {
      const skill = allSkills.find(s => s.skillId === this.selectedSkillId);
      if (skill) {
        forgetBtn.style.display = "inline-block";
        forgetBtn.textContent = `遗忘 ${ALL_SKILLS[skill.skillId].name}`;
        forgetBtn.onclick = () => {
          this.player.forgetSkill(this.selectedSkillId);
          this.selectedSkillId = null;
          this.updateSkillsPanel();
          this.updateAll();
        };
      }
    } else {
      forgetBtn.style.display = "none";
    }

    // 可学习技能（基于玩家等级）
    const availDiv = document.getElementById("available-skill-list");
    availDiv.innerHTML = "";
    const learnable = getLearnableSkills(this.player.lv, this.player.learnedSkills.active, this.player.learnedSkills.passive);
    const allLearnableIds = [...learnable.active, ...learnable.passive];

    // 更新可学技能计数
    const availHeader = document.querySelector("#available-skills h3");
    if (availHeader) {
      availHeader.textContent = `可学习技能 (${allLearnableIds.length})`;
    }

    if (allLearnableIds.length === 0) {
      // 显示即将可学的技能
      const next = getNextLearnableSkills(this.player.lv, this.player.learnedSkills.active, this.player.learnedSkills.passive);
      const nextAll = [...next.active, ...next.passive];
      if (nextAll.length > 0) {
        nextAll.sort((a, b) => a.lv - b.lv);
        const nextSkill = nextAll[0];
        availDiv.innerHTML = `<p style="color:#5a5a4a;text-align:center;padding:12px;">📖 下一技能可在 Lv.${nextSkill.lv} 学习<br><span style="font-size:11px;">${ALL_SKILLS[nextSkill.id]?.name || ""}</span></p>`;
      } else {
        availDiv.innerHTML = "<p style='color:#5a5a4a;text-align:center;padding:12px;'>🎉 已学会所有技能！</p>";
      }
    } else {
      // 限制显示数量，避免刷屏
      const showIds = allLearnableIds.slice(0, 30);
      for (const sid of showIds) {
        const def = ALL_SKILLS[sid];
        if (!def) continue;
        const canLearn = this.canLearnSkill(def);
        const card = document.createElement("div");
        card.className = "skill-card";
        card.style.opacity = canLearn ? "1" : "0.5";
        const cdInfo = def.cooldown > 0 ? `<span style="color:#ffa040;">⏳ CD:${def.cooldown}回合</span>` : `<span style="color:#60c060;">⚡ 无冷却</span>`;
        card.innerHTML = `
          <div class="skill-name">${def.name} ${canLearn ? "" : "🔒"} <span style="font-size:10px;color:#8a8a7a;">Lv.${def.learnReq?.lv || 1}</span></div>
          <div class="skill-type">${def.type === "active" ? "⚡主动" : "🔮被动"} | ${skillCategoryName(def.category)} | ${cdInfo}</div>
          <div class="skill-desc">${def.desc}</div>
          <div class="skill-lv">💰 ${def.buyPrice}金币 | 需求: ${this.getLearnReqText(def)}</div>
        `;
        if (canLearn) {
          card.addEventListener("click", () => {
            if (this.player.gold >= def.buyPrice) {
              const result = this.player.learnSkill(sid);
              if (result.success) {
                this.player.gold -= def.buyPrice;
                this.updateSkillsPanel();
                this.updateAll();
              } else {
                this.addGameLog(result.reason);
              }
            } else {
              this.addGameLog("金币不足！");
            }
          });
        }
        availDiv.appendChild(card);
      }
      if (allLearnableIds.length > 30) {
        const more = document.createElement("p");
        more.style.cssText = "color:#5a5a4a;text-align:center;font-size:11px;";
        more.textContent = `...还有 ${allLearnableIds.length - 30} 个技能可学（提升等级解锁更多）`;
        availDiv.appendChild(more);
      }
    }
  }

  canLearnSkill(def) {
    if (!def.learnReq) return true;
    if (def.learnReq.lv && this.player.lv < def.learnReq.lv) return false;
    const stats = this.player.getStats();
    if (def.learnReq.str && stats.str < def.learnReq.str) return false;
    if (def.learnReq.agi && stats.agi < def.learnReq.agi) return false;
    if (def.learnReq.int && stats.int < def.learnReq.int) return false;
    if (def.learnReq.vit && stats.vit < def.learnReq.vit) return false;
    if (def.learnReq.wis && stats.wis < def.learnReq.wis) return false;
    if (def.learnReq.ene && stats.ene < def.learnReq.ene) return false;
    return true;
  }

  getLearnReqText(def) {
    if (!def.learnReq) return "无";
    const parts = [];
    for (const key in def.learnReq) {
      if (key === "lv") parts.push(`等级 ${def.learnReq[key]}`);
      else parts.push(`${statName(key)} ${def.learnReq[key]}`);
    }
    return parts.join(", ");
  }

  updateEquipmentPanel() {
    for (const slot in this.player.equipment) {
      const eq = this.player.equipment[slot];
      const el = document.getElementById("eq-" + slot);
      if (el) {
        if (eq) {
          el.textContent = eq.name;
          el.style.color = eq.qualityColor || "#c8b87d";
        } else {
          el.textContent = "空";
          el.style.color = "#5a5a4a";
        }
      }
    }
    document.getElementById("equip-detail").innerHTML = "<p>点击装备查看详情</p>";
  }

  showEquipDetail(eq, slotName) {
    const detail = document.getElementById("equip-detail");
    let html = `<h3 style="color:${eq.qualityColor}">${eq.name}</h3>`;
    html += `<p>品质: <span style="color:${eq.qualityColor}">[${eq.qualityName}]</span></p>`;
    html += `<p>部位: ${EQUIP_SLOT_NAMES[slotName]}</p>`;
    html += `<p>需求等级: ${eq.minLv}</p>`;
    if (eq.dropTier === 1) html += `<p style="color:#a0d0ff;">⭐ 稀有掉落 — 高于人物等级的装备</p>`;
    if (eq.dropTier === 2) html += `<p style="color:#ff8c00;">🔥 传说掉落 — 远超人物等级的装备</p>`;
    html += `<h4>属性:</h4>`;
    for (const key in eq.stats) {
      html += `<p style="font-size:11px;margin:1px 0">${statName(key) || key}: +${eq.stats[key]}</p>`;
    }
    if (eq.storage) html += `<p>存储空间: +${eq.storage}</p>`;
    if (eq.affixDescs && eq.affixDescs.length > 0) {
      html += `<h4>词缀:</h4>`;
      for (const desc of eq.affixDescs) {
        html += `<p style="font-size:10px;color:#ffc040">${desc}</p>`;
      }
    }
    html += `<button class="btn-small" onclick="window.unequipSlot('${slotName}')">卸下</button>`;
    detail.innerHTML = html;
  }

  // 物品类别底色
  getCategoryClass(item) {
    if (!item) return "";
    // 装备类
    if (item.type === "equipment" || item.slot) {
      if (item.slot === "weapon") return "cat-weapon";
      return "cat-armor";
    }
    const type = item.type;
    if (type === "consumable") return "cat-consumable";
    if (type === "material") return "cat-material";
    if (type === "special") return "cat-special";
    return "";
  }

  sortInventory(mode) {
    this._invSortMode = mode;
    this.updateInventoryPanel();
  }

  _sortKey(item) {
    if (item.type === "equipment" || item.slot) {
      if (item.slot === "weapon") return "01武器";
      return "02防具";
    }
    if (item.type === "consumable") return "03消耗品";
    if (item.type === "skill_book" || item.type === "scroll") return "04技能书";
    if (item.type === "stat_potion") return "05属性药";
    if (item.type === "material") return "06材料";
    if (item.type === "special") return "07特殊";
    return "99其他";
  }

  updateInventoryPanel() {
    const invList = document.getElementById("inventory-list");
    invList.innerHTML = "";
    document.getElementById("inv-count").textContent = this.player.inventory.length;
    document.getElementById("inv-capacity").textContent = this.player.getMaxInventory();

    if (this.player.inventory.length === 0) {
      invList.innerHTML = "<p style='color:#5a5a4a;grid-column:1/-1'>背包空空如也</p>";
    } else {
      const sorted = [...this.player.inventory];
      if (this._invSortMode) {
        sorted.sort((a, b) => {
          switch (this._invSortMode) {
            case "type": {
              const ta = this._sortKey(a), tb = this._sortKey(b);
              return ta.localeCompare(tb) || (a.name || "").localeCompare(b.name || "");
            }
            case "quality": {
              const qo = { black: 6, gold: 5, yellow: 4, purple: 3, blue: 2, white: 1 };
              return (qo[b.quality] || 0) - (qo[a.quality] || 0);
            }
            case "name":
              return (a.name || "").localeCompare(b.name || "");
            case "lv":
              return (b.minLv || 0) - (a.minLv || 0) || (b.lv || 0) - (a.lv || 0);
            default:
              return 0;
          }
        });
      }
      for (const item of sorted) {
        const div = document.createElement("div");
        let cls = "inv-item";
        if (item.quality) cls += ` quality-${item.quality}`;
        cls += ` ${this.getCategoryClass(item)}`;
        div.className = cls;
        const qty = item.qty || 1;
        div.textContent = qty > 1 ? `${item.name} x${qty}` : item.name;
        if (qty > 1) div.style.fontWeight = "bold";
        div.addEventListener("click", () => {
          invList.querySelectorAll(".selected").forEach(d => d.classList.remove("selected"));
          div.classList.add("selected");
          this.showItemDetail(item);
        });
        invList.appendChild(div);
      }
    }
    document.getElementById("item-detail").innerHTML = "<p>点击物品查看详情</p>";
  }

  showItemDetail(item) {
    const detail = document.getElementById("item-detail");
    const qty = item.qty || 1;
    let html = `<h3 style="color:${item.qualityColor || '#c8b87d'}">${item.name}</h3>`;

    // 判断是否为装备：type==="equipment" 或有 slot 字段在装备槽位中
    const isEquip = item.type === "equipment" || (item.slot && EQUIP_SLOT_NAMES[item.slot]);

    // 显示堆叠数量
    if (this.player._isStackable(item) && qty > 1) {
      html += `<p style="color:#f0c040;">数量: <b>${qty}</b></p>`;
    }

    if (isEquip) {
      html += item.quality ? `<p>品质: <span style="color:${item.qualityColor}">[${item.qualityName}]</span></p>` : "";
      html += `<p>部位: ${EQUIP_SLOT_NAMES[item.slot]}</p>`;
      html += `<p>需求等级: ${item.minLv || 1}</p>`;
      if (item.dropTier === 1) html += `<p style="color:#a0d0ff;">⭐ 稀有掉落 — 高于人物等级的装备</p>`;
      if (item.dropTier === 2) html += `<p style="color:#ff8c00;">🔥 传说掉落 — 远超人物等级的装备</p>`;
      if (item.baseStats || item.stats) {
        html += `<h4>属性:</h4>`;
        const stats = item.stats || item.baseStats;
        // 对比当前装备
        const slot = item.slot;
        const currentEq = slot && this.player.equipment[slot] ? this.player.equipment[slot] : null;
        if (currentEq) {
          html += `<div style="font-size:10px;color:#5a5a4a;margin-bottom:4px;">📊 对比: <span style="color:#c8b87d;">${currentEq.name}</span></div>`;
        }
        for (const key in stats) {
          let diffHtml = "";
          if (currentEq && currentEq.stats) {
            const curVal = currentEq.stats[key] || 0;
            const newVal = stats[key];
            if (newVal > curVal) diffHtml = ` <span style="color:#60c060;font-size:10px;">▲${newVal - curVal}</span>`;
            else if (newVal < curVal) diffHtml = ` <span style="color:#ff4040;font-size:10px;">▼${curVal - newVal}</span>`;
            else diffHtml = ` <span style="color:#8a8a7a;font-size:10px;">=</span>`;
          }
          html += `<p style="font-size:11px">${statName(key) || key}: +${stats[key]}${diffHtml}</p>`;
        }
        // 显示当前装备有而新装备没有的属性
        if (currentEq && currentEq.stats) {
          for (const key in currentEq.stats) {
            if (stats[key] === undefined) {
              html += `<p style="font-size:11px;color:#ff4040;">${statName(key) || key}: <s>+${currentEq.stats[key]}</s> → 0</p>`;
            }
          }
        }
      }
      if (item.storage) html += `<p>存储空间: +${item.storage}</p>`;
      if (item.affixDescs && item.affixDescs.length > 0) {
        html += `<h4>词缀:</h4>`;
        for (const desc of item.affixDescs) {
          html += `<p style="font-size:10px;color:#ffc040">${desc}</p>`;
        }
      }
      html += `<button class="btn-small" onclick="window.equipItemById('${item.id}')">装备</button>`;
      html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售(${item.sellPrice || 2}💰)</button>`;
    } else if (item.type === "consumable") {
      html += `<p>${item.desc || ""}</p>`;
      html += `<p>售价: ${item.sellPrice || 0}💰 / 个</p>`;
      html += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">`;
      if (this.combat && this.combat.active) {
        html += `<button class="btn-small" onclick="window.useItemById('${item.id}')">使用</button>`;
      } else {
        html += `<p style="font-size:10px;color:#5a5a4a;width:100%;">战斗中才能使用</p>`;
      }
      if (qty > 1) {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售1个</button>`;
        html += `<button class="btn-small" onclick="window.sellItemAllById('${item.id}')">出售全部(${(item.sellPrice || 1) * qty}💰)</button>`;
        html += `<button class="btn-small" onclick="window.splitInventoryStack('${item.id}')">分离</button>`;
      } else {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售(${item.sellPrice || 1}💰)</button>`;
      }
      html += `</div>`;
    } else if (item.type === "skill_book" || item.type === "scroll") {
      html += `<p>${item.desc || ""}</p>`;
      html += `<p>售价: ${item.sellPrice || 0}💰</p>`;
      html += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">`;
      if (!this.combat || !this.combat.active) {
        html += `<button class="btn-small" onclick="window.useItemById('${item.id}')">学习</button>`;
      } else {
        html += `<p style="font-size:10px;color:#5a5a4a;width:100%;">非战斗时才能使用</p>`;
      }
      if (qty > 1) {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售1个</button>`;
        html += `<button class="btn-small" onclick="window.sellItemAllById('${item.id}')">出售全部(${(item.sellPrice || 1) * qty}💰)</button>`;
        html += `<button class="btn-small" onclick="window.splitInventoryStack('${item.id}')">分离</button>`;
      } else {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售(${item.sellPrice || 1}💰)</button>`;
      }
      html += `</div>`;
    } else if (item.type === "stat_potion") {
      html += `<p>${item.desc || ""}</p>`;
      html += `<p style="color:#f0c040;">效果: 永久提升1点${statName(item.stat) || item.stat}</p>`;
      html += `<p>售价: ${item.sellPrice || 0}💰</p>`;
      html += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">`;
      if (!this.combat || !this.combat.active) {
        html += `<button class="btn-small" onclick="window.useItemById('${item.id}')">饮用</button>`;
      } else {
        html += `<p style="font-size:10px;color:#5a5a4a;width:100%;">非战斗时才能使用</p>`;
      }
      if (qty > 1) {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售1个</button>`;
        html += `<button class="btn-small" onclick="window.sellItemAllById('${item.id}')">出售全部(${(item.sellPrice || 1) * qty}💰)</button>`;
        html += `<button class="btn-small" onclick="window.splitInventoryStack('${item.id}')">分离</button>`;
      } else {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售(${item.sellPrice || 1}💰)</button>`;
      }
      html += `</div>`;
    } else {
      // 材料/其他特殊物品
      html += `<p>${item.desc || ""}</p>`;
      html += `<p>售价: ${item.sellPrice || 0}💰 / 个</p>`;
      html += `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">`;
      if (qty > 1) {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售1个</button>`;
        html += `<button class="btn-small" onclick="window.sellItemAllById('${item.id}')">出售全部(${(item.sellPrice || 1) * qty}💰)</button>`;
        html += `<button class="btn-small" onclick="window.splitInventoryStack('${item.id}')">分离</button>`;
      } else {
        html += `<button class="btn-small" onclick="window.sellItemById('${item.id}')">出售(${item.sellPrice || 1}💰)</button>`;
      }
      html += `</div>`;
    }
    detail.innerHTML = html;
  }

  updateQuestsPanel() {
    const div = document.getElementById("quest-list");
    const qm = window.questManager;
    if (!qm) { div.innerHTML = "<p>任务系统未加载</p>"; return; }

    // 章节信息头
    let chapterInfo = "";
    for (const ch of MAIN_QUEST_CHAPTERS) {
      const firstQuest = ch.quests[0];
      const lastQuest = ch.quests[ch.quests.length - 1];
      const allDone = lastQuest && qm.deliveredQuests.includes(lastQuest.id);
      const hasActive = ch.quests.some(q => qm.activeQuests.find(a => a.id === q.id));
      if (hasActive || (!allDone && ch.quests.some(q => q.minLv <= (window.playerInstance ? window.playerInstance.lv + 5 : 99)))) {
        chapterInfo = `<div style="background:#1a1008;padding:6px 10px;border-radius:3px;margin-bottom:8px;border-left:3px solid #f0c040;">
          <span style="color:#f0c040;">${ch.icon} ${ch.name}</span>
          <span style="color:#5a5a4a;font-size:10px;margin-left:6px;">${ch.quests.length}个小节</span>
        </div>`;
        break; // 只显示当前章节
      }
    }

    if (qm.activeQuests.length === 0) {
      div.innerHTML = "<p style='color:#5a5a4a'>没有进行中的任务</p><p style='font-size:10px;color:#3a3a2a;margin-top:8px;'>去城市里的任务板接取支线任务吧！</p>";
    } else {
      div.innerHTML = chapterInfo;
      for (const quest of qm.activeQuests) {
        const allDone = quest.progress.every((p, i) => p.current >= quest.objectives[i].count);
        const card = document.createElement("div");
        card.className = "quest-card";
        if (allDone) card.style.border = "2px solid #f0c040";
        // 任务类型
        const typeTag = quest.type === "main"
          ? `<span style="background:#4a2a0a;color:#f0c040;font-size:9px;padding:1px 4px;border-radius:2px;">主线 · 第${quest.chapter || '?'}章</span>`
          : `<span style="background:#2a2a4a;color:#80a0ff;font-size:9px;padding:1px 4px;border-radius:2px;">支线${quest.repeatable ? ' · 可重复' : ''}</span>`;
        // 重复完成标记
        const repeatTag = quest.repeatCount > 0
          ? `<span style="color:#ffa040;font-size:9px;margin-left:4px;">第${quest.repeatCount + 1}次</span>`
          : "";

        let html = `<div class="quest-title">${quest.type === "main" ? "📌" : "📋"} ${quest.name} ${typeTag}${repeatTag}</div>`;
        // 发布者
        if (quest.giver) {
          html += `<div style="font-size:10px;color:#8a8a7a;margin:2px 0;">👤 发布者: <span style="color:#c8b87d;">${quest.giver}</span>`;
          if (quest.giverCity) html += ` · 📍 ${quest.giverCity}`;
          html += `</div>`;
        }
        html += `<div class="quest-desc">${quest.desc}</div>`;
        // 进度
        for (let i = 0; i < quest.progress.length; i++) {
          const p = quest.progress[i];
          const obj = quest.objectives[i];
          const pct = Math.min(100, Math.floor(p.current / obj.count * 100));
          const done = p.current >= obj.count;
          const doneClass = done ? "color:#f0c040;" : "color:#60c060;";
          // 从desc提取基础描述（去掉末尾的数字/数字）
          const descBase = obj.desc.replace(/\s+\d+\/\d+\s*$/, "").replace(/\s+\d+\s*\/\s*\d+\s*$/, "");
          const progressText = `${descBase} ${Math.min(p.current, obj.count)}/${obj.count}`;
          const bar = `<span style="display:inline-block;width:40px;height:6px;background:#1a1a1a;border-radius:3px;margin-left:4px;vertical-align:middle;"><span style="display:inline-block;width:${pct}%;height:6px;background:${done?'#f0c040':'#60c060'};border-radius:3px;"></span></span>`;
          const checkmark = done ? " ✅" : "";
          html += `<div style="${doneClass}">${progressText}${bar}${checkmark}</div>`;
        }
        // 奖励预览
        html += `<div style="font-size:10px;color:#5a5a4a;margin-top:4px;">🎁 奖励: `;
        const r = quest.rewards;
        if (r.exp) html += `⭐${r.exp} `;
        if (r.gold) html += `💰${Array.isArray(r.gold) ? r.gold.join('~') : r.gold} `;
        if (r.items) html += `📦${r.items.length}件 `;
        if (r.skill_book) html += `📖书 `;
        if (r.stat) html += `🧪药水 `;
        if (r.materials) html += `🔩料×${r.materials.length} `;
        html += `</div>`;
        // 交付
        if (allDone) {
          html += `<div style="font-size:11px;color:#f0c040;margin-top:6px;">📍 去向 <b>${quest.giver || "发布者"}</b> 汇报</div>`;
          html += `<button class="btn-small" onclick="window.deliverQuest('${quest.id}')" style="margin-top:4px;background:#4a3a2a;color:#f0c040;width:100%;">✅ 向 ${quest.giver || "发布者"} 交付任务</button>`;
        }
        card.innerHTML = html;
        div.appendChild(card);
      }
    }
  }

  updateLogPanel() {
    const div = document.getElementById("log-list");
    div.innerHTML = "";
    const logs = this.player.log.slice(-50);
    for (const msg of logs) {
      const p = document.createElement("p");
      p.style.cssText = "font-size:12px;margin:2px 0;border-bottom:1px solid #1a1a1a;padding:2px 0;";
      p.textContent = msg;
      div.appendChild(p);
    }
    div.scrollTop = div.scrollHeight;
  }

  // ===== 战斗UI =====
  showCombat(state) {
    const screen = document.getElementById("combat-screen");
    const map = document.getElementById("game-container");
    screen.style.display = "flex";
    map.style.display = "none";
    this.updateCombatUI(state);
  }

  hideCombat() {
    document.getElementById("combat-screen").style.display = "none";
    document.getElementById("game-container").style.display = "flex";
    document.getElementById("combat-skill-select").style.display = "none";
    document.getElementById("combat-item-select").style.display = "none";
  }

  showBattleResult(result) {
    const won = result.won;
    const enemy = result.enemy;
    const title = won ? "🎉 战斗胜利！" : "💀 战斗失败...";
    const titleColor = won ? "#60c060" : "#ff4040";
    let html = `
      <div style="text-align:center;">
        <h2 style="color:${titleColor};margin-bottom:16px;">${title}</h2>
        <p style="font-size:14px;color:#8a8a7a;">${enemy ? enemy.name : '???'} Lv.${enemy ? enemy.lv : '?'}</p>
        <hr style="border-color:#4a3a2a;margin:12px 0;">
        <div style="font-size:14px;color:#c8b87d;line-height:2.2;">
    `;
    if (won) {
      html += `<p>⭐ 经验值: <b style="color:#f0c040;">+${result.exp}</b></p>`;
      html += `<p>💰 金币: <b style="color:#ffc040;">+${result.gold}</b></p>`;
      if (result.items.length > 0) {
        html += `<p>📦 战利品:</p>`;
        for (const item of result.items) {
          html += `<p style="font-size:12px;color:#80ff80;">  ▸ ${item}</p>`;
        }
      }
    } else {
      html += `<p>💸 金币损失: <b style="color:#ff4040;">-${result.goldLost}</b></p>`;
      html += `<p style="font-size:12px;color:#ff8080;">HP恢复30%，在附近重生</p>`;
    }
    html += `
        </div>
        <button onclick="document.getElementById('modal-overlay').style.display='none';window.gameInstance.ui.updateAll();"
          style="margin-top:16px;padding:10px 30px;font-family:inherit;font-size:14px;
          background:linear-gradient(180deg,#3a2a10,#2a1a08);border:2px solid #4a3a2a;color:#c8b87d;cursor:pointer;border-radius:3px;">
          继续
        </button>
      </div>`;
    this.showModal(title, html);
  }

  updateCombatUI(state) {
    if (!state) return;

    // 玩家信息
    const hpPct = state.player.hp / state.player.maxHp * 100;
    document.getElementById("combat-player-hp").textContent = state.player.hp;
    document.getElementById("combat-player-maxhp").textContent = state.player.maxHp;
    document.getElementById("combat-player-mp").textContent = state.player.mp;
    document.getElementById("combat-player-maxmp").textContent = state.player.maxMp;
    document.getElementById("combat-player-hp-fill").style.width = hpPct + "%";
    document.getElementById("combat-player-name").textContent = `${this.player.name} (Lv.${this.player.lv})`;

    // 玩家头像 - 根据职业
    const profIcon = this.player.getProfession ? this.player.getProfession().icon : "🧑‍💼";
    document.getElementById("combat-player-sprite").querySelector(".player-image").textContent = profIcon;

    // 敌人信息
    if (state.enemy) {
      const ehpPct = state.enemy.hp / state.enemy.maxHp * 100;
      document.getElementById("combat-enemy-hp").textContent = Math.max(0, state.enemy.hp);
      document.getElementById("combat-enemy-maxhp").textContent = state.enemy.maxHp;
      document.getElementById("combat-enemy-hp-fill").style.width = Math.max(0, ehpPct) + "%";
      document.getElementById("combat-enemy-name").textContent = `${state.enemy.name} (Lv.${state.enemy.lv})`;

      // 敌人头像 - 根据类型
      const enemyIcons = {
        mutant: "👹", bandit: "💀", robot: "🤖", boss: "🐉", beast: "🐺",
      };
      const enemyIcon = enemyIcons[state.enemy.type] || "👾";
      document.getElementById("combat-enemy-sprite").querySelector(".enemy-image").textContent = enemyIcon;
    }

    // 行动按钮
    const isPlayerTurn = state.turn === "player" && state.active;
    document.querySelectorAll("#combat-actions .combat-btn").forEach(b => {
      if (b.id === "btn-auto-combat") return;
      b.disabled = !isPlayerTurn;
    });

    // 自动战斗按钮
    const autoBtn = document.getElementById("btn-auto-combat");
    autoBtn.textContent = state.autoMode ? "⏹" : "🤖";

    // 战斗日志
    const logDiv = document.getElementById("combat-log");
    logDiv.innerHTML = "";
    for (const msg of state.log) {
      const p = document.createElement("div");
      p.className = "combat-log-entry";
      if (msg.includes("伤害") || msg.includes("暴击")) p.className += " combat-log-damage";
      else if (msg.includes("恢复") || msg.includes("治愈")) p.className += " combat-log-heal";
      else p.className += " combat-log-info";
      p.textContent = msg;
      logDiv.appendChild(p);
    }
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  // ===== 战斗特效 =====
  playAttackEffect(attacker) {
    const sprite = document.getElementById(
      attacker === "player" ? "combat-player-sprite" : "combat-enemy-sprite"
    );
    if (!sprite) return;
    sprite.classList.remove("attacking");
    void sprite.offsetWidth; // reflow
    sprite.classList.add("attacking");
  }

  playHitEffect(target) {
    const sprite = document.getElementById(
      target === "player" ? "combat-player-sprite" : "combat-enemy-sprite"
    );
    if (!sprite) return;
    sprite.classList.remove("hit");
    void sprite.offsetWidth;
    sprite.classList.add("hit");
  }

  showDamageNumber(target, amount, isCrit, isHeal) {
    const area = document.getElementById(
      target === "player" ? "combat-player-area" : "combat-enemy-area"
    );
    if (!area) return;
    const el = document.createElement("div");
    el.className = "combat-damage-number";
    if (isHeal) el.className += " heal";
    if (isCrit) el.className += " crit";
    el.textContent = (isHeal ? "+" : "-") + amount;
    el.style.left = (30 + Math.random() * 60) + "px";
    el.style.top = (10 + Math.random() * 30) + "px";
    area.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }

  showMagicEffect(target) {
    const area = document.getElementById(
      target === "player" ? "combat-player-area" : "combat-enemy-area"
    );
    if (!area) return;
    const el = document.createElement("div");
    el.className = "combat-magic-effect";
    el.textContent = "✨";
    el.style.fontSize = "50px";
    el.style.left = "30px";
    el.style.top = "0px";
    area.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  showCombatSkills() {
    const div = document.getElementById("combat-skill-select");
    div.style.display = "flex";
    div.innerHTML = "";
    for (const sk of this.player.learnedSkills.active) {
      const def = ALL_SKILLS[sk.skillId];
      if (!def) continue;
      const cdLeft = (this.combat.skillCooldowns && this.combat.skillCooldowns[sk.skillId]) || 0;
      const onCooldown = cdLeft > 0;
      const btn = document.createElement("button");
      btn.className = "combat-btn";
      const cdText = def.cooldown > 0 ? ` CD:${def.cooldown}回合` : "";
      btn.textContent = `${def.name} (${def.mpCost}MP${cdText})${onCooldown ? ` [冷却中 ${cdLeft}]` : ""}`;
      btn.disabled = this.combat.playerMp < def.mpCost || onCooldown;
      btn.style.opacity = onCooldown ? "0.5" : "1";
      btn.addEventListener("click", () => {
        this.combat.playerUseSkill(sk.skillId);
        div.style.display = "none";
      });
      div.appendChild(btn);
    }
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "combat-btn";
    cancelBtn.textContent = "取消";
    cancelBtn.addEventListener("click", () => { div.style.display = "none"; });
    div.appendChild(cancelBtn);
  }

  showCombatItems() {
    const div = document.getElementById("combat-item-select");
    div.style.display = "flex";
    div.innerHTML = "";
    const consumables = this.player.inventory.filter(i => i.type === "consumable");
    if (consumables.length === 0) {
      div.innerHTML = "<span style='color:#5a5a4a'>没有可用的道具</span>";
    }
    for (const item of consumables) {
      const btn = document.createElement("button");
      btn.className = "combat-btn";
      const qty = item.qty || 1;
      btn.textContent = qty > 1 ? `${item.name} x${qty}` : item.name;
      btn.addEventListener("click", () => {
        this.combat.playerUseItem(item.id);
        div.style.display = "none";
      });
      div.appendChild(btn);
    }
    const cancelBtn = document.createElement("button");
    cancelBtn.className = "combat-btn";
    cancelBtn.textContent = "取消";
    cancelBtn.addEventListener("click", () => { div.style.display = "none"; });
    div.appendChild(cancelBtn);
  }

  // ===== 城市UI =====
  showCity(city) {
    document.getElementById("city-screen").style.display = "block";
    document.getElementById("game-container").style.display = "none";
    const stars = "★".repeat(city.size) + "☆".repeat(5 - city.size);
    document.getElementById("city-name").textContent = `🏙️ ${city.name} · ${city.country || "废土"}`;
    document.getElementById("city-detail").innerHTML = `
      <p style="font-size:15px;margin-bottom:6px;">📊 城市规模: <span style="color:#f0c040;">${stars}</span></p>
      <p style="color:#c8b87d;">${city.desc}</p>
      <p style="font-size:11px;color:#5a5a4a;margin-top:8px;">可用技能教官等级: ${city.size} · 商店品质上限: ${["普通","精良","优秀","完美","传说"][city.size-1] || "普通"}</p>
    `;
  }

  hideCity() {
    document.getElementById("city-screen").style.display = "none";
    document.getElementById("game-container").style.display = "flex";
  }

  // ===== 行动 =====
  actionExplore() {
    // 随机遭遇
    const encounter = Math.random();
    advanceGameTime(15 + Math.floor(Math.random() * 30)); // 探索耗时15-45分钟
    if (encounter < 0.35) {
      // 战斗
      const enemies = getEnemiesForLevel(this.player.lv);
      const template = enemies[Math.floor(Math.random() * enemies.length)];
      // 使用游戏级别的战斗回调 (由Game.init()统一管理)
      this.combat.startBattle(template);
    } else if (encounter < 0.45) {
      // 发现宝箱
      const quality = randomQuality(this.player.lv);
      const qInfo = QUALITY_COLORS[quality];
      const gold = 20 + Math.floor(Math.random() * this.player.lv * 15);
      this.player.gold += gold;
      this.player.gainExp(20 + Math.floor(Math.random() * 30));

      // 随机装备
      const equipPool = [...Object.values(WEAPON_BASE), ...Object.values(ARMOR_BASE)]
        .filter(e => Math.abs(e.minLv - this.player.lv) <= 5);
      if (equipPool.length > 0 && Math.random() < 0.5) {
        const base = equipPool[Math.floor(Math.random() * equipPool.length)];
        const eq = generateEquipItem(base, quality, this.player.lv);
        if (eq) {
          this.player.addItem(eq);
          this.player.addLog(`📦 发现了宝箱！获得 ${gold} 金币和 ${eq.name}[${qInfo.name}]！`);
        }
      } else {
        this.player.addLog(`📦 发现了宝箱！获得 ${gold} 金币。`);
      }
      if (window.questManager) window.questManager.updateProgress("find_chest");
      this.updateAll();
    } else if (encounter < 0.55) {
      // 找到材料
      const mats = ["scrap_metal", "steel_ingot", "circuit_board", "magic_crystal", "mutant_gland", "energy_cell"];
      const m = mats[Math.floor(Math.random() * mats.length)];
      const item = { ...ALL_ITEMS[m], id: m + "_" + Date.now() + "_" + Math.floor(Math.random() * 1000) };
      if (this.player.addItem(item)) {
        this.player.addLog(`🔍 探索中发现了 ${item.name}。`);
      }
      this.updateAll();
    } else {
      // 无事发生 - 仍有少量经验
      const minorExp = 5 + Math.floor(Math.random() * 10);
      this.player.gainExp(minorExp);
      this.player.addLog(`🔍 探索了周围，没有特别发现。（经验 +${minorExp}）`);
      this.updateAll();
    }
  }

  actionRest() {
    // 休息恢复：获得少量经验 + 清除战斗状态
    const restExp = 10 + Math.floor(Math.random() * 15);
    this.player.gainExp(restExp);
    this.player.addLog(`🏕️ 你找了个安全的地方休息了一阵，体力恢复了。`);
    this.player.addLog(`💡 休息时整理了装备和思路，经验 +${restExp}。`);
    // 如果战斗中，恢复满HP/MP
    if (this.combat && this.combat.active) {
      // 战斗中不能休息
      this.player.addLog("⚠️ 战斗中无法休息！");
      return;
    }
    this.updateAll();
  }

  actionEnterDungeon() {
    const dung = this.worldMap.findNearbyDungeon(3);
    if (dung) {
      this.player.addLog(`🏚️ 进入了 ${dung.name}...`);
      if (window.gameInstance) window.gameInstance.enterDungeon();
    }
  }

  actionEnterCity() {
    const city = this.worldMap.findNearbyCity(3);
    if (city) {
      this.player.currentCity = city;
      this.player.addLog(`🏙️ 进入了 ${city.name}。`);
      if (window.questManager) window.questManager.updateProgress("visit_city");
      if (window.gameInstance) window.gameInstance.enterCity(city);
    }
  }

  actionAutoExplore() {
    this.player.addLog("🤖 开始自动探索...");
    this.autoExploreCount = 0;
    this.doAutoExplore();
  }

  actionMultiExplore() {
    const html = `
      <div style="text-align:center;">
        <h3 style="color:#f0c040;">🤖 多次自动探索</h3>
        <p style="color:#8a8a7a;font-size:13px;margin:8px 0;">自动进行探索，战斗自动进行。<br>人物重伤或完成次数后停止。</p>
        <div style="margin:12px 0;">
          <label style="color:#c8b87d;">探索次数: </label>
          <input id="multi-count" type="number" value="10" min="1" max="100"
            style="width:80px;background:#1a1008;border:1px solid #4a3a2a;color:#c8b87d;padding:6px;font-family:inherit;font-size:14px;text-align:center;">
        </div>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;">
          <button onclick="window.closeModal();window.startMultiExplore(document.getElementById('multi-count').value);"
            style="padding:8px 20px;background:#3a2a10;border:1px solid #4a3a2a;color:#c8b87d;font-family:inherit;font-size:13px;cursor:pointer;border-radius:3px;">
            🚀 开始探索
          </button>
          <button onclick="window.closeModal();"
            style="padding:8px 20px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;font-family:inherit;font-size:13px;cursor:pointer;border-radius:3px;">
            取消
          </button>
        </div>
      </div>`;
    this.showModal("多次探索", html);
  }

  doAutoExplore() {
    if (this.combat.active) {
      this.player.addLog("🤖 自动探索暂停：战斗中。");
      return;
    }
    this.autoExploreCount = (this.autoExploreCount || 0) + 1;
    if (this.autoExploreCount > 10) {
      this.player.addLog("🤖 自动探索完成。");
      return;
    }
    this.actionExplore();
    setTimeout(() => {
      if (!this.combat.active) this.doAutoExplore();
    }, 500);
  }

  // ===== 弹窗 =====
  showModal(title, content) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = content;
    document.getElementById("modal-overlay").style.display = "flex";
  }

  // ===== 储藏室 =====
  _storageFilter = "全部";

  openStorage() {
    this.renderStorage();
    this.showModal("📦 储藏室", `<div id="storage-content"></div>`);
    document.getElementById("storage-content").innerHTML = document.getElementById("storage-render-target")?.innerHTML || "";
  }

  renderStorage() {
    const cats = this.player.getStorageByCategory();
    const catNames = { weapon: "武器", armor: "防具", consumable: "消耗品", skill: "技能书/药水", material: "材料", other: "其他" };
    const filter = this._storageFilter;

    // 过滤标签
    let filterHtml = `<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">`;
    for (const [key, label] of Object.entries({ "全部": "全部", weapon: "武器", armor: "防具", consumable: "消耗品", skill: "技能书", material: "材料", other: "其他" })) {
      const active = filter === key;
      filterHtml += `<button onclick="window.storageSetFilter('${key}')" style="padding:3px 8px;font-size:11px;background:${active?'#4a3a2a':'#1a1008'};border:1px solid ${active?'#f0c040':'#2a1a08'};color:${active?'#f0c040':'#8a8a7a'};border-radius:3px;cursor:pointer;font-family:inherit;">${label}</button>`;
    }
    filterHtml += `</div>`;

    // 储藏室物品列表
    let storageHtml = `<h5 style="margin:8px 0 4px;">📦 储藏室 (${this.player.storage.length}/${this.player.storageMax})</h5>`;
    storageHtml += `<div style="max-height:200px;overflow-y:auto;margin-bottom:12px;">`;
    let shownStorage = 0;
    for (const item of this.player.storage) {
      const cat = this._getStorageCat(item);
      if (filter !== "全部" && filter !== cat) continue;
      shownStorage++;
      const qty = item.qty || 1;
      storageHtml += `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 6px;background:#1a1008;border-bottom:1px solid #0a0804;font-size:11px;">
        <span style="color:#c8b87d;flex:1;">${item.name} ${qty > 1 ? `x${qty}` : ''}</span>
        <button onclick="window.storageWithdraw('${item.id}', 1)" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#c8b87d;cursor:pointer;font-family:inherit;">取1</button>
        ${qty > 1 ? `<button onclick="window.storageWithdraw('${item.id}', ${Math.floor(qty/2)})" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#c8b87d;cursor:pointer;font-family:inherit;margin-left:2px;">半</button>` : ''}
        <button onclick="window.storageWithdraw('${item.id}', '${qty}')" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#c8b87d;cursor:pointer;font-family:inherit;margin-left:2px;">全取</button>
      </div>`;
    }
    if (shownStorage === 0) storageHtml += `<p style="color:#5a5a4a;font-size:11px;">${filter === "全部" ? "储藏室空空如也" : "该分类无物品"}</p>`;
    storageHtml += `</div>`;

    // 背包物品列表（可存入）
    let invHtml = `<h5 style="margin:8px 0 4px;">🎒 背包 (${this.player.inventory.length}/${this.player.getMaxInventory()})</h5>`;
    invHtml += `<div style="max-height:200px;overflow-y:auto;">`;
    let shownInv = 0;
    for (const item of this.player.inventory) {
      const cat = this._getStorageCat(item);
      if (filter !== "全部" && filter !== cat) continue;
      shownInv++;
      const qty = item.qty || 1;
      const isStackable = this.player._isStackable(item);
      invHtml += `<div style="display:flex;align-items:center;justify-content:space-between;padding:4px 6px;background:#1a1008;border-bottom:1px solid #0a0804;font-size:11px;">
        <span style="color:${item.qualityColor || '#c8b87d'};flex:1;">${item.name} ${qty > 1 ? `x${qty}` : ''}</span>
        <button onclick="window.storageDeposit('${item.id}', 1)" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;cursor:pointer;font-family:inherit;">存1</button>
        ${qty > 1 ? `<button onclick="window.storageDeposit('${item.id}', ${Math.floor(qty/2)})" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;cursor:pointer;font-family:inherit;margin-left:2px;">半</button>` : ''}
        ${isStackable ? `<button onclick="window.storageDeposit('${item.id}', '${qty}')" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;cursor:pointer;font-family:inherit;margin-left:2px;">全存</button>` : `<button onclick="window.storageDeposit('${item.id}', '1')" style="padding:2px 6px;font-size:10px;background:#2a1a08;border:1px solid #4a3a2a;color:#8a8a7a;cursor:pointer;font-family:inherit;margin-left:2px;">存入</button>`}
      </div>`;
    }
    if (shownInv === 0) invHtml += `<p style="color:#5a5a4a;font-size:11px;">${filter === "全部" ? "背包无该分类物品" : "背包空空如也"}</p>`;
    invHtml += `</div>`;

    // 隐藏target供openStorage使用
    let target = document.getElementById("storage-render-target");
    if (!target) { target = document.createElement("div"); target.id = "storage-render-target"; target.style.display = "none"; document.body.appendChild(target); }
    target.innerHTML = filterHtml + storageHtml + invHtml;
  }

  _getStorageCat(item) {
    if (item.type === "equipment" || (item.slot && item.slot !== undefined)) {
      return item.slot === "weapon" ? "weapon" : "armor";
    }
    if (item.type === "consumable") return "consumable";
    if (item.type === "skill_book" || item.type === "scroll" || item.type === "stat_potion") return "skill";
    if (item.type === "material") return "material";
    return "other";
  }

  // ===== 辅助 =====
  addGameLog(msg) {
    this.player.addLog(msg);
    if (this.currentTab === "tab-log") this.updateLogPanel();
    this.updateTopBar();
  }

  // ===== 六边形地图渲染 =====
  renderHexMap(hexMap) {
    const canvas = document.getElementById("hexmap-canvas");
    if (!canvas || !hexMap) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.parentElement.clientWidth;
    const H = canvas.height = canvas.parentElement.clientHeight;

    const hexW = 28;
    const viewRadius = 8;

    const visible = hexMap.getVisibleArea(viewRadius);
    const centerX = W / 2;
    const centerY = H / 2;

    ctx.clearRect(0, 0, W, H);

    for (const tile of visible) {
      const dx = tile.x - hexMap.playerX;
      const dy = tile.y - hexMap.playerY;
      const offsetX = (tile.y % 2) * (hexW * 0.5);
      const cx = centerX + dx * hexW + offsetX;
      const cy = centerY + dy * hexW * 0.87 * 0.75;

      const terrain = HEX_TERRAIN[tile.terrain];
      const content = HEX_CONTENT[tile.content];

      // 六边形
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = Math.PI / 6 + i * Math.PI / 3;
        const hx = cx + hexW * 0.48 * Math.cos(angle);
        const hy = cy + hexW * 0.48 * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fillStyle = terrain.color;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 地形图标
      if (terrain.icon && terrain.id !== 0) {
        ctx.font = "10px serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.textAlign = "center";
        ctx.fillText(terrain.icon, cx, cy + 2);
      }

      // 内容物
      if (tile.content !== "none" && content.icon) {
        ctx.font = "14px serif";
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.textAlign = "center";
        ctx.fillText(content.icon, cx, cy - 6);
      }

      // 出口
      if (tile.isExit) {
        ctx.beginPath();
        ctx.arc(cx, cy, hexW * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240,200,40,0.5)";
        ctx.fill();
        ctx.font = "12px serif";
        ctx.fillStyle = "#f0c040";
        ctx.fillText("🚪", cx, cy + 4);
      }

      // 玩家
      if (tile.isPlayer) {
        ctx.beginPath();
        ctx.arc(cx, cy, hexW * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240,200,40,0.9)";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "16px serif";
        ctx.fillText("🧑", cx, cy + 5);
      }
    }

    document.getElementById("hexmap-stats").textContent =
      `步数: ${hexMap.steps} | 耗时: ${hexMap.totalTime}分钟`;
  }

  updateHexTileInfo(hexMap) {
    const tile = hexMap.grid[hexMap.playerY][hexMap.playerX];
    const terrain = HEX_TERRAIN[tile.terrain];
    const infoEl = document.getElementById("hexmap-tile-info");
    if (infoEl) infoEl.textContent = `${terrain.icon} ${terrain.name} - ${terrain.desc}`;
  }
}

function skillCategoryName(cat) {
  const map = { physical: "物理系", magic: "魔法系", science: "科学系", stat_boost: "属性提升", aura: "光环增幅", debuff: "减益" };
  return map[cat] || cat;
}
