# JKSoC Platform – Production Specification

---

# 1. DATABASE SCHEMA

---

## 1.1 Users (IDENTITY ONLY)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  github_id BIGINT UNIQUE NOT NULL,
  github_username TEXT NOT NULL,

  institute TEXT NOT NULL,
  institute_email TEXT UNIQUE NOT NULL,
  institute_verified BOOLEAN DEFAULT FALSE,

  suspicion_score INTEGER DEFAULT 0 CHECK (suspicion_score >= 0),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
````

---

## 1.2 Roles

```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);
```

Seed:

```sql
INSERT INTO roles (name) VALUES
('CONTRIBUTOR'),
('MAINTAINER'),
('ORGANIZER');
```

---

## 1.3 User Roles

```sql
CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

---

## 1.4 Repositories

```sql
CREATE TABLE repositories (
  id SERIAL PRIMARY KEY,

  repo_url TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('PENDING','APPROVED','REJECTED')),

  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 1.5 Contributor Stats

```sql
CREATE TABLE contributor_stats (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  score INTEGER DEFAULT 0,
  pr_count INTEGER DEFAULT 0,
  issue_count INTEGER DEFAULT 0,

  first_pr_awarded BOOLEAN DEFAULT FALSE,
  first_contribution_at TIMESTAMPTZ NULL,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 1.6 Maintainer Stats (DERIVED CACHE)

```sql
CREATE TABLE maintainer_stats (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

  repos_count INTEGER DEFAULT 0,
  prs_merged_count INTEGER DEFAULT 0,
  issues_count INTEGER DEFAULT 0,
  contributors_count INTEGER DEFAULT 0,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 1.7 Contributions (UNIQUE LOGIC KEY)

```sql
CREATE TABLE contributions (
  user_id INTEGER,
  repo_id INTEGER,
  issue_number INTEGER,
  pr_id BIGINT,

  PRIMARY KEY (user_id, repo_id, issue_number)
);
```

---

## 1.8 Processed PRs (IDEMPOTENCY)

```sql
CREATE TABLE processed_prs (
  pr_id BIGINT PRIMARY KEY,

  repo_id INTEGER,
  issue_number INTEGER,
  user_id INTEGER,

  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

# 2. AUTH SYSTEM

---

## 2.1 GitHub OAuth (MANDATORY)

* Authenticate via GitHub
* Store:

  * github_id (PRIMARY identity)
  * github_username

---

## 2.2 Institute Verification

Fields:

* institute
* institute_email
* institute_verified

Flow:

1. User submits institute email
2. OTP sent
3. Verified → set `institute_verified = true`

---

## 2.3 On User Creation

```sql
INSERT INTO contributor_stats (user_id) VALUES ($id);
INSERT INTO maintainer_stats (user_id) VALUES ($id);
```

---

# 3. ROLE SYSTEM

---

## Rules

* Roles are additive
* Contributor access is NOT role-gated
* Roles only control:

  * repo submission
  * approvals

---

# 4. REPOSITORY SYSTEM

---

## 4.1 Submit Repo

POST `/repos/submit`

```json
{
  "repoUrl": "https://github.com/org/repo"
}
```

---

## Normalization (MANDATORY)

* lowercase
* remove trailing `/`
* remove `.git`
* enforce:

```
github.com/{owner}/{repo}
```

---

## Constraints

* UNIQUE repo_url
* Only MAINTAINER role

---

## 4.2 Approval

POST `/repos/:id/approve`

* Only ORGANIZER
* Idempotent

---

## 4.3 Scope

Only:

```ts
status === "APPROVED"
```

---

## 4.4 Maintainer Attribution

Maintainer = `created_by`

---

# 5. CONTRIBUTION SYSTEM

---

## 5.1 Valid PR (ALL conditions)

```ts
pr.merged == true
repo.status == "APPROVED"
issue has label "jk-soc"
regex match exists
github user mapped
(user_id, repo_id, issue_number) not already counted
```

---

## 5.2 PR → Issue Linking

Regex:

```regex
(?i)\b(closes|fixes|resolves)\s+#(\d+)
```

Rules:

* first match only
* same repo only

---

## 5.3 Issue Reward

* Given once per issue
* Trigger: first valid PR

Reward:

```ts
+1 to issue creator
```

---

## 5.4 Contribution Timestamp

* PR → merged_at
* Issue → first PR merged_at

---

# 6. SCORING SYSTEM

---

## 6.1 PR Scoring

Per:

```
(user_id, repo_id, issue_number)
```

Rules:

* multiple PRs → 1 counted

---

## 6.2 Points

* first PR globally → +20
* others → +10

---

## 6.3 Atomic First PR

```sql
UPDATE contributor_stats
SET score = score + 20,
    first_pr_awarded = TRUE
WHERE user_id = $1
AND first_pr_awarded = FALSE;
```

Fallback → +10

---

## 6.4 First Contribution

```ts
if (first_contribution_at == null)
```

---

## 6.5 Idempotency

```sql
PRIMARY KEY (user_id, repo_id, issue_number)
PRIMARY KEY (pr_id)
```

---

# 7. SYNC SYSTEM

---

## Frequency

* incremental: 10 min
* full: 6–12 hr

---

## Flow

1. fetch PRs after last_synced_at
2. skip if in processed_prs
3. parse issue
4. validate
5. apply scoring
6. insert processed_prs
7. update sync_state (AFTER success)

---

## Rules

* batch size: ~100
* transaction per batch
* safe retries

---

# 8. CONTRIBUTOR LEADERBOARD

---

## Eligibility

```sql
WHERE first_contribution_at IS NOT NULL
```

---

## Ranking

```sql
ORDER BY
  score DESC,
  first_contribution_at ASC,
  created_at ASC
```

---

## Query

```sql
SELECT *,
RANK() OVER (
  ORDER BY score DESC, first_contribution_at ASC, created_at ASC
)
FROM contributor_stats
JOIN users USING (user_id)
WHERE first_contribution_at IS NOT NULL;
```

---

## Pagination

* limit = 50

---

## API

GET `/leaderboard?page=n`

---

## `me`

* contributor → object
* none → null

---

# 9. MAINTAINER LEADERBOARD

---

## Source

Derived from:

* processed_prs
* repositories

NOT raw GitHub

---

## Metrics

* repos_count
* prs_merged_count
* issues_count
* contributors_count

---

## Ranking

```sql
ORDER BY
  prs_merged_count DESC,
  contributors_count DESC,
  issues_count DESC,
  repos_count DESC
```

---

# 10. SEARCH

---

Endpoints:

* `/leaderboard/contributors/search`
* `/leaderboard/maintainers/search`

---

Behavior:

* case-insensitive
* partial match
* limit 10

---

Response:

```json
[
  { "username": "x", "rank": 1, "page": 1 }
]
```

---

Page:

```ts
Math.floor((rank - 1)/50)+1
```

---

# 11. PERFORMANCE

---

## Index

```sql
CREATE INDEX idx_leaderboard ON contributor_stats (
  score DESC,
  first_contribution_at ASC
);
```

---

## Cache

* TTL: 30–60s
* key: leaderboard:page:n

---

# 12. SECURITY

---

* leaderboard public
* `me` requires auth
* strict role checks

---

# 13. EDGE CASES

---

* multiple PRs → 1
* multiple users → all counted
* no PR → no points
* no issue → ignore
* reopened issues → valid (PR-driven)

---

# 14. GUARANTEES

---

* deterministic ranking
* idempotent scoring
* stable ordering
* recomputable state
* only approved repos counted

---

# 15. IMPLEMENTATION RULES

---

* NEVER compute rank in app
* ALWAYS use DB ranking
* ALWAYS treat stats as derived
