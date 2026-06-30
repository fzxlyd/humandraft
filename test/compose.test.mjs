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
