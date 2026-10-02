import { prisma } from "./db";

export type ReviewState = {
  done: number[];
  modified: number[];
  deleted: number;
  lastId: number | null;
  startedAt: string;
  updatedAt: string;
};

export type ReviewSummary = {
  total: number;
  validated: number;
  modified: number;
  deleted: number;
  remaining: number;
  updatedAt: string;
};

export const emptyState = (): ReviewState => {
  const now = new Date().toISOString();
  return { done: [], modified: [], deleted: 0, lastId: null, startedAt: now, updatedAt: now };
};

let ready = false;
async function ensureTable() {
  if (ready) return;
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS "ReviewState" ("username" TEXT PRIMARY KEY, "data" TEXT NOT NULL, "updatedAt" TEXT NOT NULL)`
  );
  ready = true;
}

const ids = (v: unknown) =>
  Array.isArray(v) ? [...new Set(v.map(Number).filter((n) => Number.isInteger(n) && n > 0))].slice(0, 20000) : [];

export function sanitize(raw: Partial<ReviewState> | null | undefined): ReviewState {
  const base = emptyState();
  if (!raw) return base;
  return {
    done: ids(raw.done),
    modified: ids(raw.modified),
    deleted: Math.max(0, Math.round(Number(raw.deleted) || 0)),
    lastId: raw.lastId && Number.isInteger(Number(raw.lastId)) ? Number(raw.lastId) : null,
    startedAt: typeof raw.startedAt === "string" ? raw.startedAt : base.startedAt,
    updatedAt: new Date().toISOString(),
  };
}

export async function getReviewState(username: string): Promise<ReviewState | null> {
  await ensureTable();
  const rows = await prisma.$queryRawUnsafe<{ data: string }[]>(
    `SELECT "data" FROM "ReviewState" WHERE "username" = ?`,
    username
  );
  if (!rows.length) return null;
  try {
    const parsed = JSON.parse(rows[0].data);
    return { ...sanitize(parsed), updatedAt: parsed.updatedAt || new Date().toISOString() };
  } catch {
    return null;
  }
}

export async function saveReviewState(username: string, state: ReviewState) {
  await ensureTable();
  await prisma.$executeRawUnsafe(
    `INSERT INTO "ReviewState" ("username", "data", "updatedAt") VALUES (?, ?, ?)
     ON CONFLICT("username") DO UPDATE SET "data" = excluded."data", "updatedAt" = excluded."updatedAt"`,
    username,
    JSON.stringify(state),
    state.updatedAt
  );
}

/** Progress summary, or null if no review was ever started. */
export async function getReviewSummary(username: string): Promise<ReviewSummary | null> {
  const state = await getReviewState(username);
  if (!state) return null;
  const products = await prisma.product.findMany({ select: { id: true } });
  const existing = new Set(products.map((p: { id: number }) => p.id));
  const validated = state.done.filter((id) => existing.has(id)).length;
  const modified = state.modified.filter((id) => existing.has(id)).length;
  if (validated === 0 && modified === 0 && state.deleted === 0) return null;
  return {
    total: products.length,
    validated,
    modified,
    deleted: state.deleted,
    remaining: products.length - validated,
    updatedAt: state.updatedAt,
  };
}
