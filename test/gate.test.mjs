import test from "node:test";
import assert from "node:assert/strict";
import { runDeslopGates } from "../src/deslop-gates.mjs";
import { runQualityGate } from "../src/gate.mjs";
import { scoreText } from "../src/score.mjs";

test("runDeslopGates catches AI phrases and preachy endings", () => {
  const gates = runDeslopGates("你绝对想不到，故事告诉我们，这就是生活。");

  assert.ok(gates.some((gate) => gate.id === "gate-a-banned-phrases" && gate.issues.length > 0));
  assert.ok(gates.some((gate) => gate.id === "gate-e-preachy-ending" && gate.issues.length > 0));
});

test("runQualityGate blocks misleading qiba health titles", () => {
  const result = runQualityGate(
    [
      "《明天体检，今晚别吃饭》",
      "",
      "【店外】",
      "周哥拎着葡萄走进店。",
      "",
      "【店内】",
      "琦爸说：“明早按体检机构要求空腹去。”"
    ].join("\n"),
    { profile: "qiba" }
  );

  assert.equal(result.status, "blocked");
  assert.ok(result.blockers.some((issue) => issue.id === "qiba-misleading-title"));
});

test("runQualityGate requires health boundaries", () => {
  const result = runQualityGate(
    [
      "《骨头汤补钙》",
      "",
      "【店外】",
      "一个人进店。",
      "",
      "【店内】",
      "琦爸说：“这样吃一定能补钙。”"
    ].join("\n"),
    { profile: "qiba" }
  );

  assert.equal(result.status, "blocked");
  assert.ok(result.blockers.some((issue) => issue.id === "qiba-health-boundary"));
});

test("scoreText returns a normalized writing score", () => {
  const result = scoreText(
    [
      "【店外】雨停了，周哥拎着水果袋站在门口。",
      "【店内】贝妈把菜单放下，琦爸从厨房看了一眼。",
      "周哥说：“明早体检，我今晚就喝粥。”",
      "贝妈把葡萄袋扎好。琦爸说：“明早按体检机构要求来。”",
      "窗外又下雨，他没再打开那袋葡萄。"
    ].join("\n"),
    { profile: "qiba" }
  );

  assert.equal(result.profile, "qiba");
  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(result.dimensions.length > 0);
});
