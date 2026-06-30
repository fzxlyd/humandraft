import test from "node:test";
import assert from "node:assert/strict";
import { generateBrief } from "../src/brief.mjs";

test("generateBrief turns one line into a qiba story brief", () => {
  const brief = generateBrief("琦爸酒食，给我故事：骨头汤补钙", {
    profile: "qiba",
    template: "story"
  });

  assert.equal(brief.profile, "qiba");
  assert.equal(brief.template, "story");
  assert.equal(brief.format, "story");
  assert.match(brief.title, /琦爸酒食/);
  assert.ok(brief.constraints.includes("琦爸不能像专家讲课"));
});

test("generateBrief picks a useful default when the user only says give me story", () => {
  const brief = generateBrief("给我故事", { profile: "qiba" });

  assert.equal(brief.topic, "隔夜菜到底能不能吃");
  assert.equal(brief.profile, "qiba");
  assert.ok(brief.need_verify.length > 0);
});

test("generateBrief rejects unknown templates", () => {
  assert.throws(() => generateBrief("x", { template: "memoir-machine" }), /Unknown template/);
});
