// ===== 废土末日 - 世界冒险 RPG =====
// 主入口

(function() {
  "use strict";

  // 等待DOM加载
  function init() {
    try {
      // 初始化游戏
      const game = new Game();

      // 输出欢迎信息
      console.log("====================================");
      console.log("  废土末日 - 世界冒险 RPG");
      console.log("  Wasteland: World Adventure");
      console.log("====================================");
      console.log("操作说明:");
      console.log("  地图: 方向键/WASD 移动, 滚轮缩放, 拖拽平移");
      console.log("  战斗: 1攻 2技能 3防 4道具 5逃 A自动");
      console.log("  副本: 方向键/WASD 移动");
      console.log("  面板: 右侧标签切换");
      console.log("  点击地图上的城市光点进入城市");
      console.log("====================================");

      // 移除此事件监听
      document.removeEventListener("DOMContentLoaded", init);

      return game;
    } catch (e) {
      console.error("游戏初始化失败:", e);
      document.body.innerHTML = `
        <div style="color:#ff4040;text-align:center;padding:40px;">
          <h1>游戏加载失败</h1>
          <p>${e.message}</p>
          <pre style="color:#5a5a4a;text-align:left;max-width:600px;margin:20px auto;">${e.stack}</pre>
        </div>
      `;
    }
  }

  // 启动
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
