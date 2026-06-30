import test from "node:test";
import assert from "node:assert/strict";
import { composeDraft } from "../src/compose.mjs";

test("composeDraft writes a draft and audits it", () => {
  const result = composeDraft(
    {
      title: "Bone soup and calcium",
      format: "short-script",
      profile: "qiba",
      style: "oral",
      scene: {
        who: "奶奶",
        action: "把汤放到桌上",
        line: "多喝点，这个补钙。"
      },
      claims: ["骨头汤好喝，但不能直接等同于补钙。"],
      evidence: ["需要补来源卡：骨钙溶出量与牛奶钙含量对照。"],
      takeaway: "汤归汤，补钙归补钙。"
    },
    { style: "oral", profile: "qiba" }
  );

  assert.equal(result.style, "oral");
  assert.equal(result.profile, "qiba");
  assert.match(result.draft, /Bone soup and calcium/);
  assert.match(result.draft, /Style Contract/);
  assert.ok(result.audit.summary.total >= 1);
});

test("composeDraft rejects unknown styles", () => {
  assert.throws(() => composeDraft({ title: "x" }, { style: "fog" }), /Unknown style/);
});

test("composeDraft renders story template", () => {
  const result = composeDraft(
    {
      title: "Qiba story",
      format: "story",
      profile: "qiba",
      style: "taste",
      topic: "骨头汤补钙",
      scene: {
        who: "一位顾客",
        action: "把保温桶放到桌边",
        line: "这汤给孩子补钙。"
      },
      beats: ["顾客带着老说法进店", "琦爸没有反驳，只问汤怎么喝", "结尾停在孩子把牛奶推回来的动作"],
      turn: "琦爸把问题从补不补拉回到怎么吃。",
      takeaway: "汤可以喝，补钙别只靠汤。"
    },
    { style: "taste", profile: "qiba" }
  );

  assert.match(result.draft, /## 故事/);
  assert.match(result.draft, /Style Contract/);
});
