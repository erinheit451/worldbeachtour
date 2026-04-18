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
import re as _re

_IDENT = _re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")


def _check_ident(name: str) -> str:
    if not _IDENT.match(name):
        raise ValueError(f"invalid SQL identifier: {name!r}")
    return name


class CoverageAssertionError(AssertionError):
    """Raised when a pipeline's post-run coverage delta is below the minimum threshold."""


def coverage_count(conn, table: str, column: str) -> int:
    """Count rows where `column` is not null. Used before/after a pipeline run."""
    _check_ident(table); _check_ident(column)
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
    """Raised on any non-2xx HTTP response. Never swallowed silently."""
    def __init__(self, message: str, status_code: int | None = None, url: str | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.url = url


def raise_for_http(resp) -> None:
    """Raise HttpError on any non-2xx. status_code and url are attached to the exception."""
    if 200 <= resp.status_code < 300:
        return
    if resp.status_code == 429:
        msg = f"rate-limited ({resp.url}): {resp.text[:200]}"
    elif resp.status_code in (401, 403):
        msg = f"auth failure {resp.status_code} ({resp.url})"
    elif 500 <= resp.status_code < 600:
        msg = f"server error {resp.status_code} ({resp.url}): {resp.text[:200]}"
    else:
        msg = f"http {resp.status_code} ({resp.url}): {resp.text[:200]}"
    raise HttpError(msg, status_code=resp.status_code, url=resp.url)
