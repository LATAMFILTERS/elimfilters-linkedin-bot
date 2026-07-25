import {test} from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import {verifyLinkedinSignature, normalizeLinkedinEvents} from "../src/security.js";

test("verifyLinkedinSignature accepts a correctly signed body", () => {
  const secret = "test-secret";
  const body = Buffer.from(JSON.stringify({id: "1", text: "hola"}));
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(verifyLinkedinSignature(body, signature, secret), true);
});

test("verifyLinkedinSignature rejects a tampered body", () => {
  const secret = "test-secret";
  const body = Buffer.from(JSON.stringify({id: "1", text: "hola"}));
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  const tampered = Buffer.from(JSON.stringify({id: "1", text: "adios"}));
  assert.equal(verifyLinkedinSignature(tampered, signature, secret), false);
});

test("verifyLinkedinSignature rejects when the signature header is missing (regression: used to return true)", () => {
  const body = Buffer.from(JSON.stringify({id: "1", text: "hola"}));
  assert.equal(verifyLinkedinSignature(body, undefined, "test-secret"), false);
  assert.equal(verifyLinkedinSignature(body, null, "test-secret"), false);
  assert.equal(verifyLinkedinSignature(body, "", "test-secret"), false);
});

test("verifyLinkedinSignature rejects when the secret is missing", () => {
  const body = Buffer.from(JSON.stringify({id: "1", text: "hola"}));
  assert.equal(verifyLinkedinSignature(body, "somesignature", undefined), false);
});

test("normalizeLinkedinEvents extracts a single comment event", () => {
  const events = normalizeLinkedinEvents(
    {id: "c1", text: "hola", author: "urn:li:person:1", authorName: "Ana"},
    "133064152"
  );
  assert.equal(events.length, 1);
  assert.equal(events[0].id, "c1");
  assert.equal(events[0].targetUrn, "urn:li:organization:133064152");
});

test("normalizeLinkedinEvents extracts a batch of events", () => {
  const events = normalizeLinkedinEvents(
    {events: [{id: "c1", text: "a"}, {id: "c2", message: "b"}, {id: "c3"}]},
    "133064152"
  );
  assert.equal(events.length, 2); // c3 has no text/message, skipped
});

test("normalizeLinkedinEvents returns empty for an empty/invalid body", () => {
  assert.deepEqual(normalizeLinkedinEvents(null, "133064152"), []);
  assert.deepEqual(normalizeLinkedinEvents({}, "133064152"), []);
});
