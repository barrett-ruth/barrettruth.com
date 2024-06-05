#!/bin/sh

[ "$#" -lt 1 ] && echo "Usage: $0 <distribution-id> <path1> [path2 ...]" && exit 1

DISTRIBUTION_ID="$1"

shift

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "$*"
