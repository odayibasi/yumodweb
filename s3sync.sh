#!/bin/bash
# This script syncronize yumodweb
aws s3 sync . s3://yumod.com  --delete --exclude ".DS_Store" --exclude "s3sync.sh"  --exclude "*git/*"