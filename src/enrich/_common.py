"""
Shared verification + logging helpers for all enrichment pipelines.

Every pipeline should:
  1. Call coverage_count() to measure baseline BEFORE running
  2. Call log_run_start() to register the run
  3. Do its work, RAISING on HTTP 429/5xx/auth (never swallow)
  4. Call log_run_finish() at the end
  5. Call assert_coverage_delta() to fail loudly if no rows were actually written
"""

import datetime as _dt


class CoverageAssertionError(AssertionError):
    """Raised when a pipeline's post-run coverage delta is below the minimum threshold."""


def coverage_count(conn, table: str, column: str) -> int:
    """Count rows where `column` is not null. Used before/after a pipeline run."""
    return conn.execute(
        f"SELECT COUNT(*) FROM {table} WHERE {column} IS NOT NULL"
    ).fetchone()[0]


def log_run_start(conn, script_name: str, phase: str = "A") -> int:
    """Insert a row in enrichment_log, return its id."""
    now = _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")
    cur = conn.execute(
        """INSERT INTO enrichment_log
           (script_name, phase, status, started_at, updated_at)
           VALUES (?, ?, 'running', ?, ?)""",
        (script_name, phase, now, now),
    )
    conn.commit()
    return cur.lastrowid


def log_run_finish(conn, run_id: int, status: str, total_processed: int = 0, total_errors: int = 0) -> None:
    """Mark the run finished. status in {'ok','error','partial'}."""
    now = _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")
    conn.execute(
        """UPDATE enrichment_log
           SET status=?, total_processed=?, total_errors=?, completed_at=?, updated_at=?
           WHERE id=?""",
        (status, total_processed, total_errors, now, now, run_id),
    )
    conn.commit()


def assert_coverage_delta(conn, table: str, column: str, before: int, min_delta: int) -> None:
    """Fail loudly if the pipeline didn't actually fill at least `min_delta` rows."""
    after = coverage_count(conn, table, column)
    delta = after - before
    if delta < min_delta:
        raise CoverageAssertionError(
            f"{table}.{column}: expected delta >= {min_delta}, got {delta} "
            f"(before={before}, after={after}). Pipeline failed silently."
        )


class HttpError(RuntimeError):
    """Raise on any HTTP 429, 5xx, or auth failure. Never swallow these silently."""


def raise_for_http(resp) -> None:
    """Call after requests.get/post. Raises HttpError on 429/auth/5xx."""
    if resp.status_code == 429:
        raise HttpError(f"rate-limited ({resp.url}): {resp.text[:200]}")
    if resp.status_code in (401, 403):
        raise HttpError(f"auth failure {resp.status_code} ({resp.url})")
    if 500 <= resp.status_code < 600:
        raise HttpError(f"server error {resp.status_code} ({resp.url}): {resp.text[:200]}")
    resp.raise_for_status()
