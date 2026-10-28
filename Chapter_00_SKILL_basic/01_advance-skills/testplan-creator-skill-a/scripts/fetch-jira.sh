#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  ./fetch-jira.sh <jira_base_url> <email> <api_token> [issue_key]

Examples:
  ./fetch-jira.sh https://your-company.atlassian.net your-email@example.com YOUR_API_TOKEN
  ./fetch-jira.sh https://your-company.atlassian.net your-email@example.com YOUR_API_TOKEN PROJ-123

Notes:
  - The script uses Jira Basic Auth with email:API token.
  - If an issue key is provided, it fetches that specific issue.
  - Otherwise, it fetches the authenticated user profile endpoint.
EOF
}

if [[ $# -lt 3 ]]; then
  usage >&2
  exit 1
fi

BASE_URL="${1%/}"
EMAIL="$2"
API_TOKEN="$3"
ISSUE_KEY="${4:-}"

if [[ -n "$ISSUE_KEY" ]]; then
  ENDPOINT="${BASE_URL}/rest/api/3/issue/${ISSUE_KEY}"
else
  ENDPOINT="${BASE_URL}/rest/api/3/myself"
fi

curl --silent --show-error --location \
  --request GET \
  --url "$ENDPOINT" \
  --user "${EMAIL}:${API_TOKEN}" \
  --header "Accept: application/json"
