#!/bin/sh

aws s3 sync . s3://barrettruth.com --delete \
    --exclude ".git/*" \
    --exclude ".github/*" \
    --exclude "readme.md" \
    --exclude ".DS_Store" \
    --exclude ".gitignore" \
    --exclude "scripts/*.sh"
