#!/bin/sh

if [ -z "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo 'No cloudfront distribution id found.'
  exit 1
fi

aws cloudfront create-invalidation --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
