"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardDesc, CardTitle } from "@/components/ui/Card";
import { Input, Label, HelperText } from "@/components/ui/Input";

type NumerologyResult = {
  lifePath: number;
  destiny: number;
  soulUrge: number;
  chart: {
    birthDigits: number[];
    birthSum: number;
    nameLetters: { char: string; value: number }[];
    destinySum: number;
    vowelLetters: { char: string; value: number }[];
    soulSum: number;
  };
};

const MASTER_NUMBERS = new Set([11, 22, 33]);

function sumDigits(n: number): number {
  return String(Math.abs(n))
    .split("")
    .reduce((acc, d) => acc + Number(d), 0);
}

function reduceNumber(n: number): number {
  let cur = n;
  while (cur > 9 && !MASTER_NUMBERS.has(cur)) cur = sumDigits(cur);
  return cur;
}

function digitsFromBirthDate(isoDate: string): number[] {
  // Accepts YYYY-MM-DD (native <input type="date"/>)
  return isoDate
    .replace(/[^0-9]/g, "")
    .split("")
    .map((d) => Number(d))
    .filter((d) => Number.isFinite(d));
}

function letterValue(char: string): number {
  // Pythagorean numerology mapping (A/J/S=1 ... I/R=9)
  const c = char.toUpperCase();
  if (c < "A" || c > "Z") return 0;
  const index = c.charCodeAt(0) - 64; // A=1
  return ((index - 1) % 9) + 1;
}

function isVowel(char: string): boolean {
  return /[AEIOUY]/i.test(char);
}

function shortDescriptor(kind: "lifePath" | "destiny" | "soulUrge", value: number): string {
  const base: Record<number, string> = {
    1: "Leader",
    2: "Harmonizer",
    3: "Creator",
    4: "Builder",
    5: "Explorer",
    6: "Nurturer",
    7: "Seeker",
    8: "Achiever",
    9: "Humanitarian",
    11: "Intuitive",
    22: "Master Builder",
    33: "Teacher",
  };

  const label = base[value] ?? "—";
  if (kind === "soulUrge") return label;
  if (kind === "destiny") return label;
  return label;
}

function computeResult(birthDate: string, fullName: string): NumerologyResult | null {
  const birthDigits = digitsFromBirthDate(birthDate);
  if (!birthDigits.length) return null;

  const birthSum = birthDigits.reduce((a, b) => a + b, 0);
  const lifePath = reduceNumber(birthSum);

  const letters = fullName
    .trim()
    .split("")
    .map((char) => ({ char, value: letterValue(char) }))
    .filter((x) => x.value > 0);

  const destinySum = letters.reduce((acc, x) => acc + x.value, 0);
  const destiny = reduceNumber(destinySum);

  const vowelLetters = letters.filter((x) => isVowel(x.char));
  const soulSum = vowelLetters.reduce((acc, x) => acc + x.value, 0);
  const soulUrge = reduceNumber(soulSum);

  return {
    lifePath,
    destiny,
    soulUrge,
    chart: { birthDigits, birthSum, nameLetters: letters, destinySum, vowelLetters, soulSum },
  };
}

function StatCard({ label, value, desc }: { label: string; value: number; desc: string }) {
  return (
    <Card className="p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-fg-muted">{label}</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-fg">{value}</p>
          <p className="mt-1 text-sm text-fg-muted">{desc}</p>
        </div>
      </div>
    </Card>
  );
}

export default function NumerologyPage() {
  const [birthDate, setBirthDate] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitted, setSubmitted] = useState<{ birthDate: string; fullName: string } | null>(null);
  const [error, setError] = useState("");

  const result = useMemo(
    () => (submitted ? computeResult(submitted.birthDate, submitted.fullName) : null),
    [submitted],
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = fullName.trim();
    if (!birthDate) {
      setError("Please select your birth date.");
      setSubmitted(null);
      return;
    }
    if (name.length < 2) {
      setError("Please enter your full name.");
      setSubmitted(null);
      return;
    }

    setError("");
    setSubmitted({ birthDate, fullName: name });
  }

  return (
    <main className="mx-auto w-full max-w-lg px-5 pb-10 pt-8">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Numerology</h1>
        <p className="text-sm text-fg-muted">Birth date + name → your core numbers</p>
      </header>

      <Card className="mt-6 p-5">
        <CardTitle className="text-base">Calculate</CardTitle>
        <CardDesc className="mt-1">Enter your details to see your Life Path, Destiny, and Soul Urge.</CardDesc>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="birthDate">Birth date</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
            <HelperText>We use this to calculate your Life Path number.</HelperText>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g. Jane Appleseed"
            />
            <HelperText>We use your name to calculate Destiny and Soul Urge.</HelperText>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Calculate
          </Button>

          {error && <p className="text-sm text-danger">{error}</p>}
        </form>
      </Card>

      {result && (
        <section className="mt-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Life Path" value={result.lifePath} desc={shortDescriptor("lifePath", result.lifePath)} />
            <StatCard label="Destiny" value={result.destiny} desc={shortDescriptor("destiny", result.destiny)} />
            <StatCard label="Soul Urge" value={result.soulUrge} desc={shortDescriptor("soulUrge", result.soulUrge)} />
          </div>

          <Card className="p-5">
            <CardTitle>Chart</CardTitle>
            <CardDesc className="mt-1">A quick breakdown of how your numbers were computed.</CardDesc>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-border bg-bg-elevated p-4">
                <p className="text-xs font-medium text-fg-muted">Birth date digits</p>
                <p className="mt-2 text-sm text-fg">
                  {result.chart.birthDigits.join(" · ")} <span className="text-fg-muted">(sum {result.chart.birthSum})</span>
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-4">
                <p className="text-xs font-medium text-fg-muted">Name values</p>
                <p className="mt-2 text-sm text-fg">
                  {result.chart.nameLetters.slice(0, 40).map((x, idx) => (
                    <span key={`${x.char}-${idx}`} className="tabular-nums">
                      {x.char.toUpperCase()}:{x.value}{idx < Math.min(result.chart.nameLetters.length, 40) - 1 ? "  " : ""}
                    </span>
                  ))}
                  <span className="text-fg-muted"> (sum {result.chart.destinySum})</span>
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-bg-elevated p-4">
                <p className="text-xs font-medium text-fg-muted">Vowels (Soul Urge)</p>
                <p className="mt-2 text-sm text-fg">
                  {result.chart.vowelLetters.length
                    ? result.chart.vowelLetters.map((x, idx) => (
                        <span key={`${x.char}-${idx}`} className="tabular-nums">
                          {x.char.toUpperCase()}:{x.value}{idx < result.chart.vowelLetters.length - 1 ? "  " : ""}
                        </span>
                      ))
                    : "—"}
                  <span className="text-fg-muted"> (sum {result.chart.soulSum})</span>
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}
    </main>
  );
}
