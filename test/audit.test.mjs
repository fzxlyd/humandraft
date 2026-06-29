import test from "node:test";
import assert from "node:assert/strict";
import { auditText } from "../src/audit.mjs";

test("detects fake suspense and unsupported authority", () => {
  const result = auditText("你绝对想不到，科学研究表明，这件事情很重要。", {
    profile: "general"
  });

  assert.equal(result.summary.high, 2);
  assert.ok(result.findings.some((finding) => finding.id === "fake-suspense"));
  assert.ok(result.findings.some((finding) => finding.id === "unsupported-authority"));
});

test("qiba profile flags food claims", () => {
  const result = auditText("奶奶：“多喝点。” 这个汤最补钙，也更有营养。", {
    profile: "qiba"
  });

  assert.ok(result.findings.some((finding) => finding.id === "qiba-food-claim-needs-evidence"));
});

test("unknown profiles are rejected", () => {
  assert.throws(() => auditText("hello", { profile: "unknown" }), /Unknown profile/);
});
