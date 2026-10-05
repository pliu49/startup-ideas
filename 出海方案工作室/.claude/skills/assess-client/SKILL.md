---
name: assess-client
description: Generates a first-draft outbound (cross-border DTC) market assessment report for a prospective consulting client, from their filled-in intake questionnaire plus real web research on comparable brands. Use this whenever the user asks to generate, draft, or update an assessment/evaluation report for a named client in this project — phrases like "生成评估报告", "出海评估", "assess-client", "给<客户名>做评估/出报告", or "更新一下<客户名>的报告" should all trigger this skill. Only applies within this 出海方案工作室 project (requires clients/<name>/intake.md to exist).
---

# assess-client

Turns a filled-in client questionnaire (`clients/<client-name>/intake.md`) into a first-draft
outbound market assessment report (`clients/<client-name>/report.md`), using real web research
for the competitor section. This is the automation for Stage ① (出海评估) of the four-stage
service (评估 → 注册对接 → 建站 → 运营).

The report is a **draft for human review**, not a client-ready deliverable. It exists to turn a
multi-hour manual research-and-writing job into a ~15-30 minute guided pass that the consultant
then reviews, corrects, and polishes — not to remove the human from a decision that touches
market judgment and (lightly) legal/tax territory.

## When invoked

The user will typically say something like "用 assess-client 给 <client-name> 生成评估报告" or
just name a client folder and ask for a report. `<client-name>` is the folder name under
`clients/`.

## Steps

1. **Load the intake data.** Read `clients/<client-name>/intake.md`.
   - If it doesn't exist, stop and tell the user: copy `templates/intake-template.md` to
     `clients/<client-name>/intake.md`, fill in what's known, then re-run.
   - Don't require every field to be filled — this questionnaire is filled during a live
     conversation with the prospect, so gaps are normal and expected.

2. **Research real comparable brands.** Identify the product category and target market from the
   intake (and any benchmark brand it names, e.g. Hailuck). Use WebSearch to find 3-5 real,
   currently-operating DTC/independent-site brands in the same category and market. For each,
   try to capture: positioning/selling points, rough price band, and how they seem to acquire
   customers (social, search/SEO, paid ads, affiliate, etc.) — whatever is actually findable.

   This is the one step that must not be faked. Never invent a brand name, URL, price, or
   traffic-channel claim. If the category is niche enough that fewer than 3 real comparables
   turn up, say so plainly in the report ("该细分品类可参考的独立站案例有限") rather than padding
   the table with invented ones — an honest gap is far more useful to the consultant reviewing
   this than a confident-sounding fabrication they won't catch.

3. **Load the report skeleton.** Read `templates/report-template.md`. It has `{{placeholder}}`
   markers for each section (项目概况, 品类与市场读数, 竞品速览 table, 主体注册建议, 预算区间表,
   建议路径与时间线, 推荐套餐, 下一步行动) and already contains the required disclaimer text.

4. **Fill it in and write the output.** Combine the intake data with your research to fill every
   placeholder, and write the result to `clients/<client-name>/report.md`.

   A few things that matter more than they might seem:

   - **Anything the intake didn't answer stays marked "待确认" in the report** — a specific,
     honest gap the consultant can chase down, not a guess dressed up as a finding. This applies
     especially to budget, whether the client already has an overseas entity, and revenue scale —
     these directly change which package (验证/标准/全案) makes sense, so guessing here doesn't
     just look bad, it can point the consultant at the wrong recommendation.
   - **The disclaimer paragraph under 主体注册建议** ("以上主体注册相关信息仅供参考，不构成法律或
     税务意见...") must survive into the output unchanged. The advice in that section is
     genuinely useful as a starting point, but it's coming from a template, not a licensed
     registered agent or accountant — the disclaimer is what keeps that distinction honest for
     whoever reads the report next.
   - **推荐套餐 (recommended package)**: pick one of 验证版/标准版/全案版 and give a real reason
     tied to the intake — e.g. no existing entity + tight budget points toward 验证版 first;
     already has an entity + committed timeline points toward 标准版 or 全案版. Don't default to
     the most expensive tier just because it sounds thorough.

5. **Tell the user what they're holding.** After writing the file, say plainly: this is a first
   draft — read it end to end (especially the competitor table and entity-registration section)
   before it goes anywhere near the actual client. Nothing gets sent or exported automatically.
   Once they're happy with it, mention they can ask to render it to PDF with the `pdf` skill for
   sending to the client — but don't do that conversion yourself unless asked.
