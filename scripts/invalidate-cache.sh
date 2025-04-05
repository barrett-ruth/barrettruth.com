#!/bin/sh

if [ -z "$1" ]; then
    echo "Must specify AWS cloudfront distribution to invalidate."
    exit
fi

aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
