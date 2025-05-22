#!/bin/sh

aws s3 sync ./dist/ s3://barrettruth.com --delete
